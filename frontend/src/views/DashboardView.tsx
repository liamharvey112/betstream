import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageLayout } from '../components/layout/PageLayout';
import { BetForm } from '../components/bets/BetForm';
import { BetList } from '../components/bets/BetList';
import { Toast } from '../components/feedback/Toast';

interface DashboardViewProps {
    userId: string;
}

export const DashboardView = ({ userId }: DashboardViewProps) => {
    const [showToast, setShowToast] = useState(false);

    const handleBetPlaced = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <PageLayout title="Dashboard" subtitle="Place and track your bets">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BetForm userId={userId} onSuccess={handleBetPlaced} />
                <BetList userId={userId} />
            </div>
            {showToast && (
                <Toast
                    message="Bet placed successfully! 🎉"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </PageLayout>
    );
};