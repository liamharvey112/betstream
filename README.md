# BetStream

Sports betting data pipeline with Go, GraphQL, gRPC, ScyllaDB and React.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Go 1.23+ |
| API | GraphQL (gqlgen) + gRPC |
| Database | ScyllaDB (NoSQL) |
| Message Broker | Redis Streams |
| Frontend | React + TypeScript + Tailwind |
| Container | Docker |
| Orchestration | Kubernetes |
| Infrastructure | Terraform (AWS) |
| CI/CD | GitHub Actions |

## Getting started
```bash
git clone https://github.com/liamharvey112/betstream.git
cd betstream
docker-compose up -d
cd backend
go mod download
go run cmd/api/main.go