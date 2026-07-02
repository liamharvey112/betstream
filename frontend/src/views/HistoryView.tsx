import { useQuery } from '@apollo/client/react';
import { GET_BETS } from '../services/graphql';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { type Bet, type GetBetsResponse } from '../types/betstream.types';

interface HistoryViewProps {
    userId: string;
}

export const HistoryView = ({ userId }: HistoryViewProps) => {
    const { loading, error, data } = useQuery<GetBetsResponse>(GET_BETS, {
        variables: { userId }
    });

    if (loading) {
        return (
            <PageLayout title="Bet History">
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout title="Bet History">
                <Alert type="error" message={error.message} />
            </PageLayout>
        );
    }

    const bets: Bet[] = data?.bets || [];

    return (
        <PageLayout title="Bet History" subtitle="View all your past bets">
            {bets.length === 0 ? (
                <Card>
                    <p className="text-gray-500 text-center py-8">No bets placed yet.</p>
                </Card>
            ) : (
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
            )}
        </PageLayout>
    );
};