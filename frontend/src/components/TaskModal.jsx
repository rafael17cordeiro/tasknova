import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from './Modal';
import { STATUSES, PRIORITIES } from '../constants';

const fieldClass =
    'w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-primary-500 focus:shadow-glow transition bg-surface';

// O deadline vem da API como "2026-12-01T00:00:00.000Z"; o input date só aceita "2026-12-01"
const toDateInput = (value) => (value ? value.slice(0, 10) : '');

export default function TaskModal({ open, onClose, task, onSave }) {
    const isEdit = task !== null;

    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [status, setStatus] = useState(task?.status ?? 'todo');
    const [priority, setPriority] = useState(task?.priority ?? 'medium');
    const [deadline, setDeadline] = useState(toDateInput(task?.deadline));
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'O título é obrigatório';
        else if (title.trim().length > 150) newErrors.title = 'O título deve ter no máximo 150 caracteres';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const success = await onSave({
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            deadline: deadline || null,
        });
        setLoading(false);

        if (success) onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title={isEdit ? 'Editar tarefa' : 'Nova tarefa'}>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                    <label htmlFor="task-title" className="block text-sm font-medium mb-1">Título</label>
                    <input
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        className={fieldClass}
                        placeholder="Ex.: Entregar relatório"
                    />
                    {errors.title && <p className="text-sm text-danger mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label htmlFor="task-description" className="block text-sm font-medium mb-1">Descrição</label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className={`${fieldClass} resize-none`}
                        placeholder="Opcional"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="task-status" className="block text-sm font-medium mb-1">Estado</label>
                        <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
                            {STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="task-priority" className="block text-sm font-medium mb-1">Prioridade</label>
                        <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)} className={fieldClass}>
                            {PRIORITIES.map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="task-deadline" className="block text-sm font-medium mb-1">Data limite</label>
                    <input
                        id="task-deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className={fieldClass}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
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
                        {isEdit ? 'Guardar alterações' : 'Criar tarefa'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}