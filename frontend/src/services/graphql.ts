import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

const httpLink = new HttpLink({
    uri: 'http://localhost:8080/query',
});

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export const GET_BETS = gql`
    query GetBets($userId: String!) {
        bets(userId: $userId) {
            id
            userId
            eventId
            amount
            odds
            status
            createdAt
        }
    }
`;

export const PLACE_BET = gql`
    mutation PlaceBet($userId: String!, $eventId: String!, $amount: Float!, $odds: Float!) {
        placeBet(userId: $userId, eventId: $eventId, amount: $amount, odds: $odds) {
            id
            userId
            eventId
            amount
            odds
            status
            createdAt
        }
    }
`;

export const GET_BET = gql`
    query GetBet($id: String!) {
        bet(id: $id) {
            id
            userId
            eventId
            amount
            odds
            status
            createdAt
        }
    }
`;