interface FullScreenLoaderProps {
    show: boolean;
    isSuccess?: boolean;
    title?: string;
    subtitle?: string;
    userName?: string;
}

export function FullScreenLoader({
    show,
    isSuccess = false,
    title = 'Proses Login...',
    subtitle = 'Mohon tunggu sebentar..!',
    userName = '',
}: FullScreenLoaderProps) {
    if (!show) return null;

    return (
        <div className="fullscreen-loader-overlay">
            <div className={`loader-card ${isSuccess ? 'success-card' : ''}`}>
                <h3 className="loader-title">
                    {isSuccess ? 'Login Berhasil!' : title}
                </h3>

                <div className="spinner-wrapper">
                    {isSuccess ? (
                        <div className="success-icon-bounce">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                    ) : (
                        <div className="interactive-spinner"></div>
                    )}
                </div>

                <p className="loader-subtitle">
                    {isSuccess ? `Selamat datang, ${userName || 'User'}!` : subtitle}
                </p>
            </div>
        </div>
    );
}
