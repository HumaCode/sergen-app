import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SignatureUploadModalProps {
    show: boolean;
    onClose: () => void;
    onSaveSignature: (file: File | null, previewUrl: string | null) => void;
}

export function SignatureUploadModal({
    show,
    onClose,
    onSaveSignature,
}: SignatureUploadModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (!show) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleConfirm = () => {
        onSaveSignature(selectedFile, previewUrl);
        onClose();
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            className={`modal-backdrop-wrap ${show ? 'show' : ''}`}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 26, 25, 0.45)',
                backdropFilter: 'blur(4px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div
                className="modal-box-inner"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '480px',
                    padding: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                        Unggah Tanda Tangan Digital
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: 'var(--ink-soft)' }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: '2px dashed #C9DAD8',
                        borderRadius: '14px',
                        padding: '28px 16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--sky)',
                        marginBottom: '16px',
                    }}
                >
                    {previewUrl ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <img
                                src={previewUrl}
                                alt="Preview TTD"
                                style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain' }}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--teal-deep)', fontWeight: 500 }}>
                                Klik untuk mengganti berkas
                            </span>
                        </div>
                    ) : (
                        <div>
                            <i className="bi bi-cloud-arrow-up" style={{ fontSize: '32px', color: 'var(--teal)' }}></i>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>
                                Klik untuk mengunggah gambar TTD
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                                Format PNG transparan direkomendasikan (Maks 5MB)
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    {previewUrl && (
                        <button
                            type="button"
                            className="btn-ghost"
                            onClick={handleClear}
                            style={{ padding: '8px 16px', fontSize: '12.5px' }}
                        >
                            Hapus
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={onClose}
                        style={{ padding: '8px 16px', fontSize: '12.5px' }}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleConfirm}
                        style={{ padding: '8px 20px', fontSize: '12.5px' }}
                    >
                        Pasang TTD
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
