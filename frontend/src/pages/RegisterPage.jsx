import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles, User, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function RegisterPage() {
    const { user, register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const validate = () => {
        const newErrors = {};
        if (name.trim().length < 2) newErrors.name = 'O nome deve ter pelo menos 2 caracteres';
        else if (name.trim().length > 100) newErrors.name = 'O nome deve ter no máximo 100 caracteres';
        if (!email.trim()) newErrors.email = 'O email é obrigatório';
        else if (!isValidEmail(email.trim())) newErrors.email = 'Formato de email inválido';
        if (password.length < 6) newErrors.password = 'A palavra-passe deve ter pelo menos 6 caracteres';
        if (confirmPassword !== password) newErrors.confirmPassword = 'As palavras-passe não coincidem';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await register(name.trim(), email.trim(), password);
            toast.success('Conta criada com sucesso');
            navigate('/');
        } catch (error) {
            const message =
                error.response?.data?.message === 'Email already registered'
                    ? 'Este email já está registado'
                    : 'Não foi possível criar a conta. Tenta novamente.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full rounded-lg border border-line pl-10 pr-3 py-2 outline-none focus:border-primary-500 focus:shadow-glow transition';

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-surface border border-line rounded-2xl shadow-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-linear-to-br from-primary-500 to-accent-400 text-white">
                        <Sparkles size={22} />
                    </div>
                    <h1 className="text-3xl font-bold">TaskNova</h1>
                </div>

                <h2 className="text-xl font-semibold">Cria a tua conta</h2>
                <p className="text-ink-muted mt-1 mb-6">Organiza o teu trabalho em projetos e tarefas.</p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="O teu nome" />
                        </div>
                        {errors.name && <p className="text-sm text-danger mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="o.teu@email.com" />
                        </div>
                        {errors.email && <p className="text-sm text-danger mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Palavra-passe</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Mínimo 6 caracteres" />
                        </div>
                        {errors.password && <p className="text-sm text-danger mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirmar palavra-passe</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Repete a palavra-passe" />
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-danger mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        Criar conta
                    </button>
                </form>

                <p className="text-sm text-ink-muted text-center mt-6">
                    Já tens conta?{' '}
                    <Link to="/login" className="text-primary-600 font-medium hover:underline">Inicia sessão</Link>
                </p>
            </div>
        </div>
    );
}