package pricing

import (
	"context"
	"time"

	"github.com/liamharvey112/betstream/internal/database"
	pb "github.com/liamharvey112/betstream/internal/pb/pricing"
)

type Odds struct {
	EventID string
	HomeOdds float64
	AwayOdds float64
	DrawOdds float64
	UpdatedAt time.Time
}

type Repository struct {}

func NewRepository() *Repository {
	return &Repository{}
}

func (r *Repository) FindByEventID(ctx context.Context, eventID string) (*Odds, error) {
	var odds Odds

	err := database.Session.Query(
		`SELECT event_id, home_odds, away_odds, draw_odds, updated_at
		 FROM odds
		 WHERE event_id = ?`,
		eventID, 
	).WithContext(ctx).Scan(&odds.EventID, &odds.HomeOdds, &odds.AwayOdds, &odds.DrawOdds, &odds.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return &odds, nil
}

func (r *Repository) Save(ctx context.Context, req *pb.UpdateOddsRequest) error {
	return database.Session.Query(
		`INSERT INTO odds (event_id, home_odds, away_odds, draw_odds, updated_at)
		 VALUES (?, ?, ?, ?, ?)`,
		req.EventId, req.HomeOdds, req.AwayOdds, req.DrawOdds, time.Now(), 
	).WithContext(ctx).Exec()
}