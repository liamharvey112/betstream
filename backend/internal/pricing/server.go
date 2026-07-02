package pricing

import (
	"context"
	"log"

	pb "github.com/liamharvey112/betstream/internal/pb/pricing"
)

type Server struct {
	pb.UnimplementedPricingServiceServer
	repo *Repository
}

func NewServer() *Server {
	return &Server{
		repo: NewRepository(),
	}
}

func (s *Server) GetOdds(ctx context.Context, req *pb.OddsRequest) (*pb.OddsResponse, error) {
	log.Printf("Received GetOdds for event: %s", req.EventId)

	odds, err := s.repo.FindByEventID(ctx, req.EventId)

	if err != nil {
		return &pb.OddsResponse{
			EventId:  req.EventId,
			HomeOdds: 2.5,
			AwayOdds: 3.2,
			DrawOdds: 2.8,
		}, nil
	}

	return &pb.OddsResponse{
		EventId:  odds.EventID,
		HomeOdds: odds.HomeOdds,
		AwayOdds: odds.AwayOdds,
		DrawOdds: odds.DrawOdds,
	}, nil
}

func (s *Server) UpdateOdds(ctx context.Context, req *pb.UpdateOddsRequest) (*pb.OddsResponse, error) {
	log.Printf("Received UpdateOdds for event: %s (Home: %.2f, Away: %.2f, Draw: %.2f)", req.EventId, req.HomeOdds, req.AwayOdds, req.DrawOdds)

	err := s.repo.Save(ctx, req)

	if err != nil {
		return nil, err
	}

	return &pb.OddsResponse{
		EventId:  req.EventId,
		HomeOdds: req.HomeOdds,
		AwayOdds: req.AwayOdds,
		DrawOdds: req.DrawOdds,
	}, nil
}