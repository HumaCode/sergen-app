import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'danger' | 'warning' | 'info' | 'secondary';

export interface ToastProps {
    show: boolean;
    type?: ToastType;
    title?: string;
    message?: string;
    onClose: () => void;
    duration?: number;
}

const DEFAULT_ICONS: Record<ToastType, string> = {
    success: 'bi-check-circle-fill',
    danger: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
    secondary: 'bi-bell-fill',
};

const DEFAULT_TITLES: Record<ToastType, string> = {
    success: 'Berhasil!',
    danger: 'Gagal!',
    warning: 'Peringatan!',
    info: 'Informasi',
    secondary: 'Notifikasi',
};

export function Toast({
    show,
    type = 'success',
    title,
    message,
    onClose,
    duration = 4000,
}: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (!show || !message) return;

        setIsExiting(false);
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [show, message, duration]);

    if (!show || !message) return null;

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
            onClose();
        }, 280);
    };

    const iconClass = DEFAULT_ICONS[type] || DEFAULT_ICONS.success;
    const toastTitle = title || DEFAULT_TITLES[type] || DEFAULT_TITLES.success;

    const toastElement = (
        <div className="dynamic-island-toast-wrap">
            <div className={`dynamic-island-toast toast-variant-${type} ${isExiting ? 'exiting' : ''}`}>
                <div className="toast-icon-badge">
                    <i className={`bi ${iconClass}`}></i>
                </div>
                <div className="toast-content">
                    <div className="toast-title">{toastTitle}</div>
                    <div className="toast-message">{message}</div>
                </div>
                <button
                    className="toast-close-btn"
                    onClick={handleClose}
                    type="button"
                    title="Tutup"
                >
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
        </div>
    );

    if (typeof window === 'undefined') return null;

    return createPortal(toastElement, document.body);
}
