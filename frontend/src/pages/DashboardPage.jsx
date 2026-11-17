import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FolderOpen } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import CreateProjectModal from '../components/CreateProjectModal';
import ConfirmModal from '../components/ConfirmModal';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    const [projects, setProjects] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [createOpen, setCreateOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Carrega os projetos quando o Dashboard aparece
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const { data } = await api.get('/projects');
                setProjects(data.projects);
                if (data.projects.length > 0) setSelectedId(data.projects[0].id);
            } catch {
                toast.error('Não foi possível carregar os projetos');
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    const handleCreateProject = useCallback(async (name) => {
        try {
            const { data } = await api.post('/projects', { name });
            setProjects((prev) => [...prev, data.project]);
            setSelectedId(data.project.id);
            toast.success('Projeto criado');
            return true;
        } catch {
            toast.error('Não foi possível criar o projeto');
            return false;
        }
    }, []);

    const handleDeleteProject = async () => {
        setDeleting(true);
        try {
            await api.delete(`/projects/${projectToDelete.id}`);
            const remaining = projects.filter((p) => p.id !== projectToDelete.id);
            setProjects(remaining);
            // Se apagámos o projeto selecionado, seleciona o primeiro que sobra
            if (selectedId === projectToDelete.id) {
                setSelectedId(remaining.length > 0 ? remaining[0].id : null);
            }
            toast.success('Projeto eliminado');
            setProjectToDelete(null);
        } catch {
            toast.error('Não foi possível eliminar o projeto');
        } finally {
            setDeleting(false);
        }
    };

    const selectedProject = projects.find((p) => p.id === selectedId);

    return (
        <div className="flex min-h-screen">
            <Sidebar
                user={user}
                projects={projects}
                selectedId={selectedId}
                loading={loading}
                onSelect={setSelectedId}
                onAdd={() => setCreateOpen(true)}
                onDelete={setProjectToDelete}
                onLogout={logout}
            />

            {/* Main Container */}
            <main className="flex-1 p-8">
                {selectedProject ? (
                    <div>
                        <h1 className="text-3xl font-bold">{selectedProject.name}</h1>
                        <p className="text-ink-muted mt-2">
                            As tarefas deste projeto vão aparecer aqui no próximo passo.
                        </p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-ink-muted">
                        <FolderOpen size={48} className="mb-4 text-primary-300" />
                        <p className="text-lg font-medium text-ink">Nenhum projeto selecionado</p>
                        <p className="mt-1">Cria um projeto na barra lateral para começar.</p>
                    </div>
                )}
            </main>

            <CreateProjectModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={handleCreateProject}
            />

            <ConfirmModal
                open={projectToDelete !== null}
                onClose={() => setProjectToDelete(null)}
                onConfirm={handleDeleteProject}
                loading={deleting}
                title="Eliminar projeto"
                message={
                    projectToDelete
                        ? `Tens a certeza que queres eliminar "${projectToDelete.name}"? Todas as tarefas deste projeto serão eliminadas e esta ação não pode ser desfeita.`
                        : ''
                }
            />
        </div>
    );
}