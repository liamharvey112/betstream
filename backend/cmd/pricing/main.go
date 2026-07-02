package main 

import (
	"log"
	"net"

	"github.com/liamharvey112/betstream/internal/database"
	pb "github.com/liamharvey112/betstream/internal/pb/pricing"
	"github.com/liamharvey112/betstream/internal/pricing"
    "google.golang.org/grpc"
)

func main() {
	err := database.Connect([]string{"localhost"}, "betstream")

	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	lis, err := net.Listen("tcp", ":50051")

	if err != nil {
		log.Fatal(err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterPricingServiceServer(grpcServer, pricing.NewServer())

	log.Println("Pricing service running on port 50051")

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatal(err)
	}
}