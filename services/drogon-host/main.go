package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"
	"time"

	_ "github.com/lib/pq"
	"log/slog"
)

// Config represents the Drogon JSON configuration
type Config struct {
	DBClients []struct {
		Name     string `json:"name"`
		RDBMS    string `json:"rdbms"`
		Host     string `json:"host"`
		Port     int    `json:"port"`
		DBName   string `json:"dbname"`
		User     string `json:"user"`
		Password string `json:"passwd"`
	} `json:"db_clients"`
	CustomConfig struct {
		CronManager struct {
			TickIntervalSeconds      int `json:"tickIntervalSeconds"`
			GracefulShutdownSeconds  int `json:"gracefulShutdownSeconds"`
			DueSlackSeconds          int `json:"dueSlackSeconds"`
		} `json:"cron_manager"`
	} `json:"custom_config"`
}

// loadConfig loads and parses a Drogon JSON config file
func loadConfig(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("cannot read config %s: %w", path, err)
	}
	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("cannot parse config: %w", err)
	}
	return &cfg, nil
}

// CronManager runs the cron daemon
type CronManager struct {
	db             *Database
	ticker         *time.Ticker
	stop           chan struct{}
	wg             sync.WaitGroup
	tickInterval   time.Duration
	gracefulShutdown time.Duration
	dueSlack       time.Duration
	logger         *slog.Logger
}

// NewCronManager creates a new cron manager
func NewCronManager(db *Database, logger *slog.Logger, tickInterval, gracefulShutdown, dueSlack time.Duration) *CronManager {
	return &CronManager{
		db:               db,
		stop:             make(chan struct{}),
		logger:           logger,
		tickInterval:     tickInterval,
		gracefulShutdown: gracefulShutdown,
		dueSlack:         dueSlack,
	}
}

// Start begins the ticker loop
func (cm *CronManager) Start(ctx context.Context) error {
	cm.ticker = time.NewTicker(cm.tickInterval)
	cm.wg.Add(1)
	go func() {
		defer cm.wg.Done()
		cm.tickerLoop(ctx)
	}()
	cm.logger.Info("CronManager started", "interval", cm.tickInterval.Seconds())
	return nil
}

// Stop gracefully shuts down the manager
func (cm *CronManager) Stop() {
	close(cm.stop)
	done := make(chan struct{})
	go func() {
		cm.wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(cm.gracefulShutdown):
		cm.logger.Warn("graceful shutdown timeout exceeded")
	}
	if cm.ticker != nil {
		cm.ticker.Stop()
	}
	cm.logger.Info("CronManager stopped")
}

// tickerLoop runs periodic ticks
func (cm *CronManager) tickerLoop(ctx context.Context) {
	for {
		select {
		case <-cm.stop:
			return
		case <-cm.ticker.C:
			if err := cm.runTick(ctx); err != nil {
				cm.logger.Error("tick error", "err", err)
			}
		}
	}
}

// TickStats holds statistics for a tick
type TickStats struct {
	Enqueued  int
	Skipped   int
	Errors    int
	Inspected int
}

// runTick executes one tick: load due schedules, enqueue jobs, reschedule
func (cm *CronManager) runTick(ctx context.Context) error {
	stats := &TickStats{}

	rows, err := cm.db.QueryDueSchedules(ctx)
	if err != nil {
		return fmt.Errorf("query due schedules: %w", err)
	}
	defer rows.Close()

	stats.Inspected = len(rows)

	for _, row := range rows {
		id := row.ID
		name := row.Name
		cronExpr := row.Cron
		handler := row.Handler
		payload := row.Payload

		// Parse cron expression
		next, err := NextFireTime(cronExpr, time.Now())
		if err != nil {
			cm.logger.Error("invalid cron expression", "name", name, "expr", cronExpr, "err", err)
			stats.Skipped++
			continue
		}

		// Enqueue job
		if err := cm.db.EnqueueJob(ctx, name, handler, payload, id); err != nil {
			cm.logger.Error("enqueue job failed", "name", name, "err", err)
			stats.Errors++
			continue
		}

		// Reschedule
		if err := cm.db.RescheduleJob(ctx, id, next); err != nil {
			cm.logger.Error("reschedule job failed", "name", name, "err", err)
			stats.Errors++
			continue
		}

		stats.Enqueued++
	}

	if stats.Enqueued > 0 || stats.Errors > 0 {
		cm.logger.Info("cron tick", "enqueued", stats.Enqueued, "skipped", stats.Skipped, "errors", stats.Errors)
	}

	return nil
}

// main parses CLI args and runs the appropriate daemon
func main() {
	logger := slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

	if len(os.Args) < 2 {
		logger.Error("missing subcommand")
		os.Exit(1)
	}

	cmd := os.Args[1]

	// Handle cron-manager subcommand
	if cmd == "cron-manager" {
		fs := flag.NewFlagSet("cron-manager", flag.ExitOnError)
		configPath := fs.String("config", "config/config.json", "Path to Drogon JSON config")
		fs.Parse(os.Args[2:])

		if err := runCronManager(*configPath, logger); err != nil {
			logger.Error("cron-manager error", "err", err)
			os.Exit(1)
		}
		return
	}

	logger.Error("unknown subcommand", "cmd", cmd)
	os.Exit(1)
}

// runCronManager is the main entry for the cron-manager daemon
func runCronManager(configPath string, logger *slog.Logger) error {
	// Load configuration
	cfg, err := loadConfig(configPath)
	if err != nil {
		return err
	}

	// Get database config
	if len(cfg.DBClients) == 0 {
		return fmt.Errorf("no database clients in config")
	}

	dbCfg := cfg.DBClients[0]
	dsnTemplate := "host=%s port=%d dbname=%s user=%s password=%s sslmode=disable"
	dsn := fmt.Sprintf(dsnTemplate, dbCfg.Host, dbCfg.Port, dbCfg.DBName, dbCfg.User, dbCfg.Password)

	// Connect to database
	db, err := NewDatabase(dsn, logger)
	if err != nil {
		return fmt.Errorf("database connection failed: %w", err)
	}
	defer db.Close()

	// Default intervals from custom_config or hardcoded
	tickInterval := 30 * time.Second
	gracefulShutdown := 10 * time.Second
	dueSlack := 1 * time.Second

	if cfg.CustomConfig.CronManager.TickIntervalSeconds > 0 {
		tickInterval = time.Duration(cfg.CustomConfig.CronManager.TickIntervalSeconds) * time.Second
	}
	if cfg.CustomConfig.CronManager.GracefulShutdownSeconds > 0 {
		gracefulShutdown = time.Duration(cfg.CustomConfig.CronManager.GracefulShutdownSeconds) * time.Second
	}
	if cfg.CustomConfig.CronManager.DueSlackSeconds > 0 {
		dueSlack = time.Duration(cfg.CustomConfig.CronManager.DueSlackSeconds) * time.Second
	}

	// Create and start cron manager
	cm := NewCronManager(db, logger, tickInterval, gracefulShutdown, dueSlack)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := cm.Start(ctx); err != nil {
		return err
	}

	logger.Info("cron-manager daemon ready")

	// Wait for signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	sig := <-sigChan
	logger.Info("shutdown signal received", "signal", sig)

	cm.Stop()
	return nil
}
