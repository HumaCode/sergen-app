interface LogoutModalProps {
    show: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function LogoutModal({
    show,
    isLoading = false,
    onClose,
    onConfirm,
}: LogoutModalProps) {
    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={!isLoading ? onClose : undefined}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon-danger">
                    {isLoading ? (
                        <div className="logout-spinner"></div>
                    ) : (
                        <i className="bi bi-box-arrow-right"></i>
                    )}
                </div>
                <h3 className="modal-title">
                    {isLoading ? 'Mengakhiri Sesi...' : 'Konfirmasi Keluar'}
                </h3>
                <p className="modal-desc">
                    {isLoading
                        ? 'Mohon tunggu sebentar, sedang memproses logout..'
                        : 'Apakah Anda yakin ingin keluar dari aplikasi SerGen?'}
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
                                <span>Sedang Proses...</span>
                            </div>
                        ) : (
                            'Ya, Keluar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
