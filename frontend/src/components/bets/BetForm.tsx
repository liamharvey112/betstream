import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { PLACE_BET } from '../../services/graphql';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Modal } from '../ui/Modal';

interface BetFormProps {
    userId: string;
    onSuccess: () => void;
}

export const BetForm = ({ userId, onSuccess }: BetFormProps) => {
    const [eventId, setEventId] = useState('');
    const [amount, setAmount] = useState('10');
    const [odds, setOdds] = useState('2.0');
    const [showConfirm, setShowConfirm] = useState(false);
    const [placeBet, { loading, error }] = useMutation(PLACE_BET);

    const handlePlaceBet = async () => {
        try {
            await placeBet({
                variables: {
                    userId,
                    eventId,
                    amount: parseFloat(amount),
                    odds: parseFloat(odds)
                }
            });
            setShowConfirm(false);
            setEventId('');
            setAmount('10');
            setOdds('2.0');
            onSuccess();
        } catch (err) {
            // Error is handled by Apollo
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    return (
        <>
            <Card title="Place a Bet">
                {error && (
                    <Alert
                        type="error"
                        message="Failed to place bet. Please try again."
                        className="mb-4"
                    />
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Event ID"
                        value={eventId}
                        onChange={setEventId}
                        placeholder="e.g., event-123"
                        required
                    />
                    <Input
                        label="Amount ($)"
                        type="number"
                        value={amount}
                        onChange={setAmount}
                        required
                        min="1"
                        step="0.5"
                    />
                    <Input
                        label="Odds"
                        type="number"
                        value={odds}
                        onChange={setOdds}
                        required
                        min="1.01"
                        step="0.01"
                    />
                    <Button type="submit" loading={loading} fullWidth>
                        Place Bet
                    </Button>
                </form>
            </Card>

            <Modal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Confirm Bet"
                showActions
                onConfirm={handlePlaceBet}
                confirmLoading={loading}
            >
                <p className="text-gray-700">
                    Place <strong>${amount}</strong> bet on <strong>{eventId}</strong> at <strong>{odds}</strong> odds?
                </p>
            </Modal>
        </>
    );
};