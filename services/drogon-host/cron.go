package main

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

// CronExpression represents a parsed cron expression (minute, hour, day, month, dow)
type CronExpression struct {
	Minute []int
	Hour   []int
	Day    []int
	Month  []int
	DOW    []int // 0=Sunday, 6=Saturday
}

// parseCron parses a standard 5-field cron expression
// Format: minute hour day month dow
// Examples:
//   "0 * * * *" = every hour at minute 0
//   "30 14 * * *" = daily at 14:30
//   "0 9 * * 1-5" = weekdays at 09:00
func parseCron(expr string) (*CronExpression, error) {
	fields := strings.Fields(strings.TrimSpace(expr))
	if len(fields) != 5 {
		return nil, fmt.Errorf("cron expression must have 5 fields, got %d", len(fields))
	}

	cx := &CronExpression{}
	var err error

	if cx.Minute, err = parseField(fields[0], 0, 59); err != nil {
		return nil, fmt.Errorf("minute: %w", err)
	}
	if cx.Hour, err = parseField(fields[1], 0, 23); err != nil {
		return nil, fmt.Errorf("hour: %w", err)
	}
	if cx.Day, err = parseField(fields[2], 1, 31); err != nil {
		return nil, fmt.Errorf("day: %w", err)
	}
	if cx.Month, err = parseField(fields[3], 1, 12); err != nil {
		return nil, fmt.Errorf("month: %w", err)
	}
	if cx.DOW, err = parseField(fields[4], 0, 6); err != nil {
		return nil, fmt.Errorf("dow: %w", err)
	}

	return cx, nil
}

// parseField parses a single cron field
// Supports: *, n, n-m, */n, n,o,p
func parseField(field string, min, max int) ([]int, error) {
	field = strings.TrimSpace(field)

	if field == "*" {
		return fillRange(min, max), nil
	}

	// */n (every n)
	if strings.HasPrefix(field, "*/") {
		step, err := strconv.Atoi(field[2:])
		if err != nil {
			return nil, err
		}
		return stepRange(min, max, step), nil
	}

	// n-m or n-m/step (range)
	if strings.Contains(field, "-") && !strings.HasPrefix(field, "-") {
		parts := strings.Split(field, "-")
		if len(parts) == 2 {
			start, err := strconv.Atoi(parts[0])
			if err != nil {
				return nil, err
			}

			// Check for step
			var endVal int
			step := 1
			if strings.Contains(parts[1], "/") {
				endParts := strings.Split(parts[1], "/")
				endVal, _ = strconv.Atoi(endParts[0])
				step, _ = strconv.Atoi(endParts[1])
			} else {
				endVal, _ = strconv.Atoi(parts[1])
			}

			var result []int
			for i := start; i <= endVal; i += step {
				if i >= min && i <= max {
					result = append(result, i)
				}
			}
			return result, nil
		}
	}

	// n,o,p (list)
	if strings.Contains(field, ",") {
		var result []int
		for _, s := range strings.Split(field, ",") {
			s = strings.TrimSpace(s)
			n, err := strconv.Atoi(s)
			if err != nil {
				return nil, err
			}
			if n >= min && n <= max {
				result = append(result, n)
			}
		}
		return result, nil
	}

	// Single number
	n, err := strconv.Atoi(field)
	if err != nil {
		return nil, err
	}
	if n < min || n > max {
		return nil, fmt.Errorf("value %d out of range [%d, %d]", n, min, max)
	}
	return []int{n}, nil
}

// fillRange returns a slice of all integers from min to max
func fillRange(min, max int) []int {
	var result []int
	for i := min; i <= max; i++ {
		result = append(result, i)
	}
	return result
}

// stepRange returns every step-th value from min to max
func stepRange(min, max, step int) []int {
	var result []int
	for i := min; i <= max; i += step {
		result = append(result, i)
	}
	return result
}

// contains checks if a slice contains a value
func contains(slice []int, val int) bool {
	for _, v := range slice {
		if v == val {
			return true
		}
	}
	return false
}

// NextFireTime calculates the next execution time for a cron expression
func NextFireTime(cronExpr string, from time.Time) (time.Time, error) {
	cx, err := parseCron(cronExpr)
	if err != nil {
		return time.Time{}, err
	}

	// Start from the next minute
	t := from.Add(1 * time.Minute).Truncate(1 * time.Minute)

	// Search forward up to 4 years
	deadline := t.AddDate(4, 0, 0)

	for t.Before(deadline) {
		if matches(cx, t) {
			return t, nil
		}
		t = t.Add(1 * time.Minute)
	}

	return time.Time{}, fmt.Errorf("no matching time found within 4 years")
}

// matches checks if a given time matches the cron expression
func matches(cx *CronExpression, t time.Time) bool {
	if !contains(cx.Minute, t.Minute()) {
		return false
	}
	if !contains(cx.Hour, t.Hour()) {
		return false
	}

	// Day or DOW check (either can match, but not both constrain)
	dayMatch := contains(cx.Day, t.Day())
	dowMatch := contains(cx.DOW, int(t.Weekday()))

	// If both are specified (not wildcards), use OR logic
	// If either is wildcard, use AND logic
	if len(cx.Day) == 31 && len(cx.DOW) == 7 {
		// Both wildcards, always true
		return true
	} else if len(cx.Day) == 31 {
		// Day is wildcard, use DOW
		if !dowMatch {
			return false
		}
	} else if len(cx.DOW) == 7 {
		// DOW is wildcard, use day
		if !dayMatch {
			return false
		}
	} else {
		// Both specified, use OR
		if !dayMatch && !dowMatch {
			return false
		}
	}

	if !contains(cx.Month, int(t.Month())) {
		return false
	}

	return true
}
