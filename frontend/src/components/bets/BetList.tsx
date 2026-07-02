import { useQuery } from '@apollo/client/react';
import { GET_BETS } from '../../services/graphql';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { Alert } from '../ui/Alert';
import { type Bet, type GetBetsResponse } from '../../types/betstream.types';

interface BetListProps {
    userId: string;
}

export const BetList = ({ userId }: BetListProps) => {
    const { loading, error, data } = useQuery<GetBetsResponse>(GET_BETS, {
        variables: { userId }
    });

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                type="error"
                message={`Error loading bets: ${error.message}`}
                className="mb-4"
            />
        );
    }

    const bets: Bet[] = data?.bets || [];

    if (bets.length === 0) {
        return (
            <Card>
                <p className="text-gray-500 text-center py-8">
                    No bets placed yet. Place your first bet!
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {bets.map((bet) => (
                <Card key={bet.id}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500">Event: {bet.eventId}</p>
                            <p className="text-lg font-semibold text-gray-900">
                                ${bet.amount} @ {bet.odds}
                            </p>
                            <p className="text-sm text-gray-500">
                                {new Date(bet.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <Badge variant={bet.status === 'WON' ? 'success' : bet.status === 'LOST' ? 'danger' : 'warning'}>
                            {bet.status || 'PENDING'}
                        </Badge>
                    </div>
                </Card>
            ))}
        </div>
    );
};