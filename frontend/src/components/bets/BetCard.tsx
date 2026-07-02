import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { type Bet } from "../../types/betstream.types";

interface BetCardProps {
    bet: Bet;
    onClick?: () => void;
}

export const BetCard = ({ bet, onClick }: BetCardProps) => {
    const statusVariant = bet.status === 'WON' ? 'success' : bet.status === 'LOST' ? 'danger' : 'warning';

    return (
        <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-shadow">
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
                <Badge variant={statusVariant}>
                    {bet.status || 'PENDING'}
                </Badge>
            </div>
        </Card>
    );
};