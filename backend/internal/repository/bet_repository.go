package repository

import (
    "context"
    "time"

    "github.com/gocql/gocql"
    "github.com/liamharvey112/betstream/internal/database"
)

type Bet struct {
    ID        gocql.UUID `json:"id"`
    UserID    string     `json:"userId"`
    EventID   string     `json:"eventId"`
    Amount    float64    `json:"amount"`
    Odds      float64    `json:"odds"`
    Status    string     `json:"status"`
    CreatedAt time.Time  `json:"createdAt"`
}

type BetRepository struct{}

func NewBetRepository() *BetRepository {
    return &BetRepository{}
}

func (r *BetRepository) Save(ctx context.Context, bet *Bet) error {
    bet.ID = gocql.TimeUUID()
    bet.CreatedAt = time.Now()
    bet.Status = "PENDING"

    return database.Session.Query(
        `INSERT INTO bets (id, user_id, event_id, amount, odds, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        bet.ID, bet.UserID, bet.EventID, bet.Amount, bet.Odds, bet.Status, bet.CreatedAt,
    ).WithContext(ctx).Exec()
}

func (r *BetRepository) FindByUserID(ctx context.Context, userID string) ([]Bet, error) {
    var bets []Bet
    var bet Bet

    iter := database.Session.Query(
        `SELECT id, user_id, event_id, amount, odds, status, created_at
         FROM bets
         WHERE user_id = ?
		 ALLOW FILTERING`,
        userID,
    ).WithContext(ctx).Iter()

    for iter.Scan(&bet.ID, &bet.UserID, &bet.EventID, &bet.Amount, &bet.Odds, &bet.Status, &bet.CreatedAt) {
        bets = append(bets, bet)
    }

    if err := iter.Close(); err != nil {
        return nil, err
    }

    return bets, nil
}

func (r *BetRepository) FindByID(ctx context.Context, id string) (*Bet, error) {
    var bet Bet

    err := database.Session.Query(
        `SELECT id, user_id, event_id, amount, odds, status, created_at
         FROM bets
         WHERE id = ?`,
        id,
    ).WithContext(ctx).Scan(&bet.ID, &bet.UserID, &bet.EventID, &bet.Amount, &bet.Odds, &bet.Status, &bet.CreatedAt)

    if err != nil {
        return nil, err
    }

    return &bet, nil
}