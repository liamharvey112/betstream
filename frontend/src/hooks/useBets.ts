import { useQuery, useMutation } from '@apollo/client/react';
import { GET_BETS, PLACE_BET } from '../services/graphql';
import type { GetBetsResponse } from '../types/betstream.types';

export const useBets = (userId: string) => {
    const { loading, error, data, refetch } = useQuery<GetBetsResponse>(GET_BETS, {
        variables: { userId }
    });

    const [placeBetMutation, { loading: placingBet, error: placeError }] = useMutation(PLACE_BET);

    const placeBet = async (eventId: string, amount: number, odds: number) => {
        const result = await placeBetMutation({
            variables: { userId, eventId, amount, odds }
        });
        await refetch();
        return result;
    };

    return {
        bets: data?.bets || [],
        loading,
        error,
        placingBet,
        placeError,
        placeBet,
        refetch
    }
}