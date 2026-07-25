package service

import (
    "context"
    "log"
    "time"

    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"

    "github.com/liamharvey112/betstream/internal/database"
    pb "github.com/liamharvey112/betstream/internal/pb/pricing"
    "github.com/liamharvey112/betstream/internal/repository"
    "github.com/redis/go-redis/v9"
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
    // Call Pricing Service
    conn, err := grpc.NewClient("pricing:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
    if err != nil {
        log.Printf("Failed to connect to pricing service: %v", err)
    } else {
        defer conn.Close()
        client := pb.NewPricingServiceClient(conn)
        resp, err := client.GetOdds(ctx, &pb.OddsRequest{EventId: eventID})
        if err == nil {
            log.Printf("Current odds for %s: Home=%.2f, Away=%.2f, Draw=%.2f",
                eventID, resp.HomeOdds, resp.AwayOdds, resp.DrawOdds)
        }
    }

    bet := &repository.Bet{
        UserID:  userID,
        EventID: eventID,
        Amount:  amount,
        Odds:    odds,
    }

    err = s.repo.Save(ctx, bet)
    if err != nil {
        return nil, err
    }

    if database.RedisClient != nil {
        _, err = database.RedisClient.XAdd(ctx, &redis.XAddArgs{
            Stream: "bet.placed",
            Values: map[string]interface{}{
                "user_id": userID,
                "event_id": eventID,
                "amount": amount,
                "odds": odds,
                "timestamp": time.Now().Unix(),
            },
        }).Result()

        if err != nil {
            log.Printf("Failed to publish Redis event: %v", err)
        } else {
            log.Printf("Published bet.placed event for user %s", userID)
        }
    }

    return bet, nil
}

func (s *BetService) GetBetsByUser(ctx context.Context, userID string) ([]repository.Bet, error) {
    return s.repo.FindByUserID(ctx, userID)
}

func (s *BetService) GetBetByID(ctx context.Context, id string) (*repository.Bet, error) {
    return s.repo.FindByID(ctx, id)
}