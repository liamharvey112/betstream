package graph

import (
    "context"

    "github.com/liamharvey112/betstream/graph/model"
    "github.com/liamharvey112/betstream/internal/service"
)

type Resolver struct {
    BetService *service.BetService
}

func NewResolver() *Resolver {
    return &Resolver{
        BetService: service.NewBetService(),
    }
}

func (r *Resolver) Mutation() MutationResolver {
    return &mutationResolver{r}
}

func (r *Resolver) Query() QueryResolver {
    return &queryResolver{r}
}

type mutationResolver struct{ *Resolver }

func (m *mutationResolver) PlaceBet(ctx context.Context, userId string, eventId string, amount float64, odds float64) (*model.Bet, error) {
    bet, err := m.BetService.PlaceBet(ctx, userId, eventId, amount, odds)
    if err != nil {
        return nil, err
    }

    return &model.Bet{
        ID:        bet.ID.String(),
        UserID:    bet.UserID,
        EventID:   bet.EventID,
        Amount:    bet.Amount,
        Odds:      bet.Odds,
        CreatedAt: bet.CreatedAt.Format("2006-01-02T15:04:05Z"),
    }, nil
}

type queryResolver struct{ *Resolver }

func (q *queryResolver) Bets(ctx context.Context, userId string) ([]*model.Bet, error) {
    bets, err := q.BetService.GetBetsByUser(ctx, userId)
    if err != nil {
        return nil, err
    }

    var result []*model.Bet
    for _, b := range bets {
        result = append(result, &model.Bet{
            ID:        b.ID.String(),
            UserID:    b.UserID,
            EventID:   b.EventID,
            Amount:    b.Amount,
            Odds:      b.Odds,
            CreatedAt: b.CreatedAt.Format("2006-01-02T15:04:05Z"),
        })
    }
    return result, nil
}

func (q *queryResolver) Bet(ctx context.Context, id string) (*model.Bet, error) {
    bet, err := q.BetService.GetBetByID(ctx, id)
    if err != nil {
        return nil, err
    }

    return &model.Bet{
        ID:        bet.ID.String(),
        UserID:    bet.UserID,
        EventID:   bet.EventID,
        Amount:    bet.Amount,
        Odds:      bet.Odds,
        CreatedAt: bet.CreatedAt.Format("2006-01-02T15:04:05Z"),
    }, nil
}