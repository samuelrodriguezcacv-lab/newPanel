import Modal from '../Modal';

const toneStyles = {
    info: {
        badge: 'bg-blue-50 text-blue-700 border-blue-100',
        primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-100',
    },
    success: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        primary: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-100',
    },
    warning: {
        badge: 'bg-amber-50 text-amber-700 border-amber-100',
        primary: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-100',
    },
    danger: {
        badge: 'bg-red-50 text-red-700 border-red-100',
        primary: 'bg-red-600 hover:bg-red-700 focus:ring-red-100',
    },
};

export default function FeedbackModal({
    show,
    title,
    message,
    tone = 'info',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    showCancel = false,
    loading = false,
    onConfirm,
    onCancel,
}) {
    const styles = toneStyles[tone] ?? toneStyles.info;

    return (
        <Modal show={show} maxWidth="md" closeable={!loading} onClose={onCancel}>
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${styles.badge}`}>
                        {tone === 'danger' ? '!' : tone === 'success' ? '✓' : 'i'}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
                        {message && (
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    {showCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 disabled:opacity-50 ${styles.primary}`}
                    >
                        {loading ? 'Procesando...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
