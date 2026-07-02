export interface Bet {
    id: string;
    userId: string;
    eventId: string;
    amount: number;
    odds: number;
    status: 'PENDING' | 'WON' | 'LOST';
    createdAt: string;
}

export interface Pricing {
    eventId: string;
    homeOdds: number;
    awayOdds: number;
    drawOdds: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface GetBetsResponse {
    bets: Bet[];
}

export interface GetBetResponse {
    bet: Bet | null;
}

export interface PlaceBetResponse {
    placeBet: Bet;
}