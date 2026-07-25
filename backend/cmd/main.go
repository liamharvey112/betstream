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
	err := database.Connect([]string{"scylla"}, "betstream")

	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	// Connect to Redis
	err = database.ConnectRedis("redis:6379")

	if err != nil {
		log.Fatal(err)
	}

	// Create Resolver
	resolver := graph.NewResolver()

	// Setup GraphQL server
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	// Routes
	http.Handle("/query", corsMiddleware(srv))
	http.Handle("/playground", playground.Handler("BetStream GraphQL Playground", "/query"))

	log.Println("Server is running on http://localhost:8080")
	log.Println("GraphQL Playground: http://localhost:8080/playground")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// CORS Middleware
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}