package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log/slog"
	"time"

	_ "github.com/lib/pq"
)

// ScheduledJob represents a row from scheduled_jobs table
type ScheduledJob struct {
	ID      int32
	Name    string
	Cron    string
	Handler string
	Payload string
}

// Database wraps PostgreSQL connection
type Database struct {
	conn   *sql.DB
	logger *slog.Logger
}

// NewDatabase creates a new database connection
func NewDatabase(dsn string, logger *slog.Logger) (*Database, error) {
	conn, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := conn.PingContext(ctx); err != nil {
		return nil, err
	}

	conn.SetMaxOpenConns(4)
	conn.SetMaxIdleConns(2)

	return &Database{conn: conn, logger: logger}, nil
}

// Close closes the database connection
func (d *Database) Close() error {
	if d.conn != nil {
		return d.conn.Close()
	}
	return nil
}

// QueryDueSchedules returns all scheduled_jobs due for execution
// Uses SELECT FOR UPDATE SKIP LOCKED for HA safety
func (d *Database) QueryDueSchedules(ctx context.Context) ([]*ScheduledJob, error) {
	query := `
		SELECT id, name, cron, handler, payload::text
		FROM scheduled_jobs
		WHERE enabled = TRUE
		  AND (next_run_at IS NULL OR next_run_at <= now())
		FOR UPDATE SKIP LOCKED
	`

	rows, err := d.conn.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query scheduled jobs: %w", err)
	}
	defer rows.Close()

	var jobs []*ScheduledJob
	for rows.Next() {
		var job ScheduledJob
		if err := rows.Scan(&job.ID, &job.Name, &job.Cron, &job.Handler, &job.Payload); err != nil {
			return nil, fmt.Errorf("scan job: %w", err)
		}
		jobs = append(jobs, &job)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return jobs, nil
}

// EnqueueJob inserts a job into the job_queue table
func (d *Database) EnqueueJob(ctx context.Context, name, handler string, payload json.RawMessage, scheduledJobID int32) error {
	query := `
		INSERT INTO job_queue (name, handler, payload, scheduled_job_id, created_at, status)
		VALUES ($1, $2, $3::jsonb, $4, now(), 'pending')
	`

	_, err := d.conn.ExecContext(ctx, query, name, handler, string(payload), scheduledJobID)
	if err != nil {
		return fmt.Errorf("enqueue job: %w", err)
	}

	return nil
}

// RescheduleJob updates the next_run_at for a scheduled job
func (d *Database) RescheduleJob(ctx context.Context, jobID int32, nextRun time.Time) error {
	query := `
		UPDATE scheduled_jobs
		SET last_run_at = now(),
		    next_run_at = $1
		WHERE id = $2
	`

	_, err := d.conn.ExecContext(ctx, query, nextRun, jobID)
	if err != nil {
		return fmt.Errorf("reschedule job: %w", err)
	}

	return nil
}
