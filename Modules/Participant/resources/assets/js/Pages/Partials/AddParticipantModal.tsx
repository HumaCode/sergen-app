interface AddParticipantModalProps {
    show: boolean;
    onClose: () => void;
}

export function AddParticipantModal({ show, onClose }: AddParticipantModalProps) {
    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-card"
                style={{ maxWidth: '520px', textAlign: 'left' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="modal-title" style={{ margin: 0 }}>Tambah Peserta Baru</h3>
                    <button
                        onClick={onClose}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: 'var(--ink-faint)' }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px', display: 'block' }}>
                                Nama Lengkap <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Masukkan nama peserta"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', outline: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px', display: 'block' }}>
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                placeholder="contoh@domain.com"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', outline: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px', display: 'block' }}>
                                Instansi / Perusahaan
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama instansi"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', outline: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={onClose} type="button">
                            Batal
                        </button>
                        <button className="btn-logout" style={{ background: 'var(--teal)' }} type="submit">
                            Simpan Peserta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
