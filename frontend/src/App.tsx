import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/graphql';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardView } from './views/DashboardView';
import { HistoryView } from './views/HistoryView';
import { Navbar } from './components/layout/Navbar';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { Spinner } from './components/ui/Spinner';
import { Button } from './components/ui/Button';

type Page = 'dashboard' | 'history';

function AppContent() {
    const { user, login, logout, isAuthenticated, loading } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to BetStream</h2>
                    <p className="text-gray-600 mb-4">Sign in to start placing bets.</p>
                    <Button onClick={login} fullWidth>
                        Sign in (Demo)
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                user={user}
                onLogout={logout}
            />
            <div className="py-6">
                <ErrorBoundary>
                    {currentPage === 'dashboard' ? (
                        <DashboardView userId={user.id} />
                    ) : (
                        <HistoryView userId={user.id} />
                    )}
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <ApolloProvider client={client}>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </ApolloProvider>
        </ErrorBoundary>
    );
}