import { useCallback, useState } from 'react';
import FeedbackModal from '../Components/molecules/FeedbackModal';

export function useFeedbackModal() {
    const [dialog, setDialog] = useState(null);

    const close = useCallback((result) => {
        setDialog((current) => {
            current?.resolve?.(result);
            return null;
        });
    }, []);

    const ask = useCallback((options) => {
        return new Promise((resolve) => {
            setDialog({
                tone: 'info',
                confirmText: 'Aceptar',
                cancelText: 'Cancelar',
                showCancel: false,
                ...options,
                resolve,
            });
        });
    }, []);

    const notify = useCallback((options) => ask({
        showCancel: false,
        ...options,
    }), [ask]);

    const confirm = useCallback((options) => ask({
        showCancel: true,
        confirmText: 'Confirmar',
        ...options,
    }), [ask]);

    const feedbackModal = (
        <FeedbackModal
            show={Boolean(dialog)}
            title={dialog?.title}
            message={dialog?.message}
            tone={dialog?.tone}
            confirmText={dialog?.confirmText}
            cancelText={dialog?.cancelText}
            showCancel={dialog?.showCancel}
            onConfirm={() => close(true)}
            onCancel={() => close(false)}
        />
    );

    return {
        feedbackModal,
        notify,
        confirm,
    };
}
