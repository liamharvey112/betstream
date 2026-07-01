package service

import (
	"context"

	"github.com/liamharvey112/betstream/internal/repository"
)

type BetService struct {
	repo *repository.BetRepository
}

func NewBetService() *BetService {
	return &BetService{
		repo: repository.NewBetRepository(),
	}
}

func (s *BetService) PlaceBet(ctx context.Context, userID, eventID string, amount, odds float64) (*repository.Bet, error) {
	bet := &repository.Bet{
		UserID:  userID,
		EventID: eventID,
		Amount:  amount,
		Odds:    odds,
	}

	err := s.repo.Save(ctx, bet)
	if err != nil {
		return nil, err
	}

	return bet, nil
}

func (s *BetService) GetBetsByUser(ctx context.Context, userID string) ([]repository.Bet, error) {
	return s.repo.FindByUserID(ctx, userID)
}

func (s *BetService) GetBetByID(ctx context.Context, id string) (*repository.Bet, error) {
	return s.repo.FindByID(ctx, id)
}