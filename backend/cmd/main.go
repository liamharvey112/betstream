package main 

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
    "github.com/99designs/gqlgen/graphql/playground"
    "github.com/liamharvey112/betstream/graph"
    "github.com/liamharvey112/betstream/internal/database"
)

func main() {
	// Connect to ScyllaDB
	err := database.Connect([]string{"localhost"}, "betstream")

	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	// Create Resolver
	resolver := graph.NewResolver()

	// Setup GraphQL server
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	// Routes
	http.Handle("/query", srv)
	http.Handle("/playground", playground.Handler("BetStream GraphQL Playground", "/query"))

	log.Println("Server is running on http://localhost:8080")
	log.Println("GraphQL Playground: http://localhost:8080/playground")
	log.Fatal(http.ListenAndServe(":8080", nil))
}