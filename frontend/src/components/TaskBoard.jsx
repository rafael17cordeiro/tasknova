import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Search, ClipboardList } from 'lucide-react';
import api from '../api/axios';
import { STATUSES, PRIORITIES } from '../constants';
import TaskRow from './TaskRow';
import TaskModal from './TaskModal';
import ConfirmModal from './ConfirmModal';
import { getErrorMessage } from '../utils/getErrorMessage';

const selectClass =
    'rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary-500 focus:shadow-glow transition';

export default function TaskBoard({ project }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Modais
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [modalKey, setModalKey] = useState(0);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Debounce: só atualiza a pesquisa 400 ms depois da última tecla
    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Carrega as tarefas sempre que o projeto ou um filtro muda
    useEffect(() => {
        let cancelled = false;

        const loadTasks = async () => {
            setLoading(true);
            try {
                const params = {};
                if (statusFilter) params.status = statusFilter;
                if (priorityFilter) params.priority = priorityFilter;
                if (search.trim()) params.search = search.trim();

                const { data } = await api.get(`/projects/${project.id}/tasks`, { params });
                if (!cancelled) setTasks(data.tasks);
            } catch {
                if (!cancelled) toast.error('Não foi possível carregar as tarefas');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadTasks();
        // Se o projeto/filtro mudar antes da resposta chegar, ignora a resposta antiga
        return () => {
            cancelled = true;
        };
    }, [project.id, statusFilter, priorityFilter, search]);

    const openCreate = () => {
        setEditingTask(null);
        setModalKey((k) => k + 1);
        setModalOpen(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setModalKey((k) => k + 1);
        setModalOpen(true);
    };

    // Recarrega a lista a partir do servidor (mantém os filtros ativos corretos)
    const reload = useCallback(async () => {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (priorityFilter) params.priority = priorityFilter;
        if (search.trim()) params.search = search.trim();
        const { data } = await api.get(`/projects/${project.id}/tasks`, { params });
        setTasks(data.tasks);
    }, [project.id, statusFilter, priorityFilter, search]);

    const handleSave = async (values) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask.id}`, values);
                toast.success('Tarefa atualizada');
            } else {
                await api.post(`/projects/${project.id}/tasks`, values);
                toast.success('Tarefa criada');
            }
            await reload();
            return true;
        } catch (error) {
            toast.error(getErrorMessage(error, 'Não foi possível guardar a tarefa'));
            return false;
        }
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await api.put(`/tasks/${task.id}`, { status: newStatus });
            await reload();
            toast.success('Estado atualizado');
        } catch (error) {
            toast.error(getErrorMessage(error, 'Não foi possível atualizar o estado'));
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/tasks/${taskToDelete.id}`);
            setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
            toast.success('Tarefa eliminada');
            setTaskToDelete(null);
        } catch {
            toast.error('Não foi possível eliminar a tarefa');
        } finally {
            setDeleting(false);
        }
    };

    const hasFilters = statusFilter || priorityFilter || search.trim();

    return (
        <div>
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <p className="text-ink-muted mt-1">
                        {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
                        {hasFilters && ' (filtradas)'}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shrink-0"
                >
                    <Plus size={18} /> Nova tarefa
                </button>
            </div>

            {/* Barra de ferramentas */}
            <div className="flex flex-col gap-3 sm:flex-row mb-5">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Pesquisar tarefas pelo título..."
                        aria-label="Pesquisar tarefas"
                        className="w-full rounded-lg border border-line bg-surface pl-10 pr-3 py-2 outline-none focus:border-primary-500 focus:shadow-glow transition"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filtrar por estado"
                    className={selectClass}
                >
                    <option value="">Todos os estados</option>
                    {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    aria-label="Filtrar por prioridade"
                    className={selectClass}
                >
                    <option value="">Todas as prioridades</option>
                    {PRIORITIES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                </select>
            </div>

            {/* Lista */}
            {loading ? (
                <p className="text-ink-muted">A carregar tarefas...</p>
            ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center text-center text-ink-muted py-16">
                    <ClipboardList size={48} className="mb-4 text-primary-300" />
                    <p className="text-lg font-medium text-ink">
                        {hasFilters ? 'Nenhuma tarefa corresponde aos filtros' : 'Ainda não há tarefas neste projeto'}
                    </p>
                    <p className="mt-1">
                        {hasFilters ? 'Experimenta alterar a pesquisa ou os filtros.' : 'Carrega em "Nova tarefa" para criar a primeira.'}
                    </p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            onEdit={openEdit}
                            onDelete={setTaskToDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </ul>
            )}

            <TaskModal
                key={modalKey}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                task={editingTask}
                onSave={handleSave}
            />

            <ConfirmModal
                open={taskToDelete !== null}
                onClose={() => setTaskToDelete(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Eliminar tarefa"
                message={taskToDelete ? `Tens a certeza que queres eliminar "${taskToDelete.title}"? Esta ação não pode ser desfeita.` : ''}
            />
        </div>
    );
}