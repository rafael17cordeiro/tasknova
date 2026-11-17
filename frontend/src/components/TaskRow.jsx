import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { STATUSES, priorityMeta } from '../constants';

const formatDate = (value) =>
    new Date(value.slice(0, 10) + 'T00:00:00').toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

// Compara apenas a data (sem horas) para saber se já passou
const isOverdue = (deadline, status) => {
    if (!deadline || status === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(deadline.slice(0, 10) + 'T00:00:00') < today;
};

export default function TaskRow({ task, onEdit, onDelete, onStatusChange }) {
    const priority = priorityMeta(task.priority);
    const overdue = isOverdue(task.deadline, task.status);
    const done = task.status === 'done';

    return (
        <li className="bg-surface border border-line rounded-xl p-4 shadow-card flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${done ? 'line-through text-ink-muted' : ''}`}>
                    {task.title}
                </p>
                {task.description && (
                    <p className="text-sm text-ink-muted mt-0.5 line-clamp-2">{task.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.className}`}>
                        {priority.label}
                    </span>
                    {task.deadline && (
                        <span
                            className={`flex items-center gap-1 text-xs ${overdue ? 'text-danger font-medium' : 'text-ink-muted'}`}
                        >
                            <CalendarDays size={14} />
                            {formatDate(task.deadline)}
                            {overdue && ' (atrasada)'}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task, e.target.value)}
                    aria-label={`Estado da tarefa ${task.title}`}
                    className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm outline-none focus:border-primary-500 focus:shadow-glow"
                >
                    {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                <button
                    onClick={() => onEdit(task)}
                    aria-label={`Editar tarefa ${task.title}`}
                    className="p-2 rounded-lg text-ink-muted hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={() => onDelete(task)}
                    aria-label={`Eliminar tarefa ${task.title}`}
                    className="p-2 rounded-lg text-ink-muted hover:bg-danger/10 hover:text-danger transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </li>
    );
}