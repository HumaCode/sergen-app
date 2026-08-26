interface ParticipantStatCardsProps {
    total: number;
    issued: number;
    pending: number;
    failed: number;
}

export function ParticipantStatCards({ total, issued, pending, failed }: ParticipantStatCardsProps) {
    return (
        <div className="stat-grid">
            <div className="stat-card teal participant-stat">
                <div className="icon-box">
                    <i className="bi bi-people"></i>
                </div>
                <div>
                    <div className="value">{total.toLocaleString('id-ID')}</div>
                    <div className="label">Total Peserta</div>
                </div>
            </div>

            <div className="stat-card sky participant-stat">
                <div className="icon-box">
                    <i className="bi bi-award"></i>
                </div>
                <div>
                    <div className="value">{issued.toLocaleString('id-ID')}</div>
                    <div className="label">Sertifikat Terbit</div>
                </div>
            </div>

            <div className="stat-card sun participant-stat">
                <div className="icon-box">
                    <i className="bi bi-hourglass-split"></i>
                </div>
                <div>
                    <div className="value">{pending.toLocaleString('id-ID')}</div>
                    <div className="label">Menunggu Proses</div>
                </div>
            </div>

            <div className="stat-card coral participant-stat">
                <div className="icon-box">
                    <i className="bi bi-exclamation-circle"></i>
                </div>
                <div>
                    <div className="value">{failed.toLocaleString('id-ID')}</div>
                    <div className="label">Gagal / Perlu Cek</div>
                </div>
            </div>
        </div>
    );
}
