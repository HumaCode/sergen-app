import React from 'react';
import { createPortal } from 'react-dom';

interface ConfirmDeleteModalProps {
    show: boolean;
    title?: string;
    description?: React.ReactNode;
    itemName?: string;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmDeleteModal({
    show,
    title = 'Hapus Template Sertifikat?',
    description,
    itemName,
    isLoading = false,
    onClose,
    onConfirm,
}: ConfirmDeleteModalProps) {
    if (!show) return null;

    const modalContent = (
        <div className="modal-backdrop" onClick={!isLoading ? onClose : undefined}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon-danger">
                    {isLoading ? (
                        <div className="logout-spinner"></div>
                    ) : (
                        <i className="bi bi-trash3-fill"></i>
                    )}
                </div>
                <h3 className="modal-title">{isLoading ? 'Menghapus Data...' : title}</h3>
                <p className="modal-desc">
                    {description ? (
                        description
                    ) : (
                        <>
                            Apakah Anda yakin ingin menghapus <strong>"{itemName}"</strong>? Tindakan ini tidak dapat dibatalkan.
                        </>
                    )}
                </p>
                <div className="modal-actions">
                    <button
                        className="btn-cancel"
                        onClick={onClose}
                        type="button"
                        disabled={isLoading}
                    >
                        Batal
                    </button>
                    <button
                        className="btn-logout"
                        onClick={onConfirm}
                        type="button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="btn-loading-content">
                                <span className="btn-spinner-white"></span>
                                <span>Menghapus...</span>
                            </div>
                        ) : (
                            'Ya, Hapus'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
