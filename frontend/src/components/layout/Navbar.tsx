import { Button } from '../ui/Button';

interface NavbarProps {
    currentPage: 'dashboard' | 'history';
    onPageChange: (page: 'dashboard' | 'history') => void;
    user?: { name: string; avatarUrl?: string } | null;
    onLogout?: () => void;
}

export const Navbar = ({ currentPage, onPageChange, user, onLogout }: NavbarProps) => {
    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">BetStream</h1>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <Button
                            variant={currentPage === 'dashboard' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange('dashboard')}
                        >
                            Dashboard
                        </Button>
                        <Button
                            variant={currentPage === 'history' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange('history')}
                        >
                            History
                        </Button>
                    </div>
                    {user && (
                        <>
                            <span className="text-gray-700 hidden sm:inline">{user.name}</span>
                            <Button variant="danger" size="sm" onClick={onLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};