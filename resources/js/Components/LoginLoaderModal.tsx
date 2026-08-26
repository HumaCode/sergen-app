export function LoginLoaderModal({ isVisible }: { isVisible: boolean }) {
    if (!isVisible) return null;

    return (
        <div className="login-loader-overlay">
            <div className="login-loader-card">
                <h3>Proses Login...</h3>
                <div className="spinner-wrap">
                    <div className="spinner-ring"></div>
                    <i className="bi bi-patch-check-fill spinner-icon"></i>
                </div>
                <p>Mohon tunggu sebentar...!</p>
            </div>
        </div>
    );
}
