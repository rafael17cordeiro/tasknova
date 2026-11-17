import { Loader2 } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({ open, onClose, onConfirm, title, message, loading }) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <p className="text-ink-muted">{message}</p>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg border border-line hover:bg-primary-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-danger text-white font-medium hover:opacity-90 disabled:opacity-60 transition"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Eliminar
                </button>
            </div>
        </Modal>
    );
}