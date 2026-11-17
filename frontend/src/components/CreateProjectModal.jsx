import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from './Modal';

export default function CreateProjectModal({ open, onClose, onCreate }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setName('');
        setError('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('O nome do projeto é obrigatório');
            return;
        }
        if (name.trim().length > 100) {
            setError('O nome deve ter no máximo 100 caracteres');
            return;
        }

        setLoading(true);
        const success = await onCreate(name.trim());
        setLoading(false);

        if (success) handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose} title="Novo projeto">
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="project-name" className="block text-sm font-medium mb-1">
                    Nome do projeto
                </label>
                <input
                    id="project-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-primary-500 focus:shadow-glow transition"
                    placeholder="Ex.: Faculdade"
                />
                {error && <p className="text-sm text-danger mt-1">{error}</p>}

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg border border-line hover:bg-primary-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60 transition-colors"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Criar projeto
                    </button>
                </div>
            </form>
        </Modal>
    );
}