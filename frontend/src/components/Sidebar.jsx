import { Sparkles, Plus, Folder, Trash2, LogOut } from 'lucide-react';

export default function Sidebar({
    user,
    projects,
    selectedId,
    loading,
    onSelect,
    onAdd,
    onDelete,
    onLogout,
}) {
    return (
        <aside className="w-72 shrink-0 h-screen sticky top-0 flex flex-col bg-surface border-r border-line">
            {/* Cabeçalho */}
            <div className="flex items-center gap-3 p-5 border-b border-line">
                <div className="p-2 rounded-xl bg-linear-to-br from-primary-500 to-accent-400 text-white">
                    <Sparkles size={20} />
                </div>
                <span className="text-xl font-display font-bold">TaskNova</span>
            </div>

            {/* Lista de projetos */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                        Projetos
                    </h2>
                    <button
                        onClick={onAdd}
                        aria-label="Novo projeto"
                        className="p-1.5 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {loading && <p className="text-sm text-ink-muted">A carregar...</p>}

                {!loading && projects.length === 0 && (
                    <p className="text-sm text-ink-muted">
                        Ainda não tens projetos. Carrega no + para criar o primeiro.
                    </p>
                )}

                <ul className="space-y-1">
                    {projects.map((project) => {
                        const isSelected = project.id === selectedId;
                        return (
                            <li key={project.id}>
                                <div
                                    className={`group flex items-center gap-2 rounded-lg transition-colors ${isSelected ? 'bg-primary-50 text-primary-700' : 'hover:bg-canvas'
                                        }`}
                                >
                                    <button
                                        onClick={() => onSelect(project.id)}
                                        className="flex-1 flex items-center gap-2 px-3 py-2 text-left min-w-0"
                                    >
                                        <Folder size={16} className="shrink-0" />
                                        <span className="truncate font-medium">{project.name}</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(project)}
                                        aria-label={`Eliminar projeto ${project.name}`}
                                        className="p-2 mr-1 rounded-lg text-ink-muted opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-danger transition"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Rodapé com o utilizador */}
            <div className="p-4 border-t border-line">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-linear-to-br from-primary-500 to-accent-400 text-white flex items-center justify-center font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-ink-muted truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        aria-label="Terminar sessão"
                        className="p-2 rounded-lg text-ink-muted hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}