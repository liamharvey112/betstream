package main

import (
    "context"
    "log"

    "github.com/liamharvey112/betstream/internal/database"
    "github.com/redis/go-redis/v9"
)

func main() {
    err := database.ConnectRedis("localhost:6379")
    if err != nil {
        log.Fatal(err)
    }
    defer database.CloseRedis()

    ctx := context.Background()
    log.Println("Listening for bet.placed events...")

    for {
        results, err := database.RedisClient.XRead(ctx, &redis.XReadArgs{
            Streams: []string{"bet.placed", "$"},
            Count:   10,
            Block:   0,
        }).Result()

        if err != nil {
            log.Printf("Error: %v", err)
            continue
        }

        for _, stream := range results {
            for _, msg := range stream.Messages {
                log.Printf("Received: %+v", msg.Values)
            }
        }
    }
}