import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-surface border border-line rounded-2xl shadow-card p-8 text-center">
                <h1 className="text-2xl font-bold">Olá, {user.name}!</h1>
                <p className="text-ink-muted mt-2">Sessão iniciada como {user.email}</p>
                <button
                    onClick={logout}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line hover:bg-primary-50 transition-colors"
                >
                    <LogOut size={18} /> Terminar sessão
                </button>
            </div>
        </div>
    );
}