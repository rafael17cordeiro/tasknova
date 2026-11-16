import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Se já tem sessão, vai direto para a aplicação
    if (user) return <Navigate to="/" replace />;

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'O email é obrigatório';
        else if (!isValidEmail(email.trim())) newErrors.email = 'Formato de email inválido';
        if (!password) newErrors.password = 'A palavra-passe é obrigatória';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email.trim(), password);
            toast.success('Sessão iniciada com sucesso');
            navigate('/');
        } catch (error) {
            const message =
                error.response?.status === 401
                    ? 'Email ou palavra-passe incorretos'
                    : 'Não foi possível iniciar sessão. Tenta novamente.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-surface border border-line rounded-2xl shadow-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-linear-to-br from-primary-500 to-accent-400 text-white">
                        <Sparkles size={22} />
                    </div>
                    <h1 className="text-3xl font-bold">TaskNova</h1>
                </div>

                <h2 className="text-xl font-semibold">Bem-vindo de volta</h2>
                <p className="text-ink-muted mt-1 mb-6">Inicia sessão para aceder ao teu espaço de trabalho.</p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-line pl-10 pr-3 py-2 outline-none focus:border-primary-500 focus:shadow-glow transition"
                                placeholder="o.teu@email.com"
                            />
                        </div>
                        {errors.email && <p className="text-sm text-danger mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Palavra-passe</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-line pl-10 pr-3 py-2 outline-none focus:border-primary-500 focus:shadow-glow transition"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-sm text-danger mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        Iniciar sessão
                    </button>
                </form>

                <p className="text-sm text-ink-muted text-center mt-6">
                    Ainda não tens conta?{' '}
                    <Link to="/register" className="text-primary-600 font-medium hover:underline">Cria uma agora</Link>
                </p>
            </div>
        </div>
    );
}