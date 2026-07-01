package database

import (
	"fmt"
	"log"

	"github.com/gocql/gocql"
)

var Session *gocql.Session

func Connect(hosts []string, keyspace string) error {
	cluster := gocql.NewCluster(hosts...)
	cluster.Keyspace = keyspace
	cluster.Consistency = gocql.Quorum

	session, err := cluster.CreateSession()

	if err != nil {
		return fmt.Errorf("Failed to connect to ScyllaDB: %w", err)
	}

	Session = session
	log.Println("Connected to ScyllaDB successfully")
	return nil
}

func Close() {
	if Session != nil {
		Session.Close()
	}
}