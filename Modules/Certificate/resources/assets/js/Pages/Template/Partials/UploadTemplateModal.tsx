import { useForm, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface UploadTemplateModalProps {
    show: boolean;
    onClose: () => void;
    onSuccessNotification?: (message: string) => void;
}

export function UploadTemplateModal({ show, onClose, onSuccessNotification }: UploadTemplateModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        orientation: 'landscape' | 'portrait';
        file: File | null;
    }>({
        name: '',
        orientation: 'landscape',
        file: null,
    });

    useEffect(() => {
        if (data.file && data.file.type.startsWith('image/')) {
            const url = URL.createObjectURL(data.file);
            setPreviewUrl(url);

            // Auto detect image orientation & aspect ratio
            const img = new Image();
            img.src = url;
            img.onload = () => {
                if (img.width > 0 && img.height > 0) {
                    const detectedOrientation = img.width >= img.height ? 'landscape' : 'portrait';
                    setData((prev) => ({
                        ...prev,
                        orientation: detectedOrientation,
                    }));
                }
            };

            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [data.file]);

    if (!show) return null;

    const handleClose = () => {
        reset();
        setPreviewUrl(null);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const templateName = data.name;
        post('/certificates/templates', {
            forceFormData: true,
            onSuccess: () => {
                handleClose();
                if (onSuccessNotification) {
                    onSuccessNotification(`Template "${templateName}" berhasil disimpan!`);
                }
            },
            onError: (errs) => {
                console.error('Validation / Upload Errors:', errs);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '');
            
            setData((prev) => ({
                ...prev,
                file: selectedFile,
                name: prev.name.trim() === '' ? cleanName : prev.name,
            }));
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <div className={`modal-backdrop-wrap ${show ? 'show' : ''}`} onClick={handleClose}>
            <div className="modal-box-inner modal-xxl" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head-row">
                    <h3>Upload Template Baru</h3>
                    <button className="modal-close-btn" onClick={handleClose} type="button">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleFileChange}
                    />

                    {data.file ? (
                        <div
                            className="drop-zone-box"
                            style={{
                                padding: '20px',
                                borderStyle: 'solid',
                                borderColor: 'var(--teal)',
                                background: 'var(--teal-soft)',
                            }}
                        >
                            {previewUrl ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                    <div
                                        style={{
                                            maxHeight: '220px',
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                            background: '#fff',
                                            padding: '6px',
                                        }}
                                    >
                                        <img
                                            src={previewUrl}
                                            alt="Preview Template"
                                            style={{
                                                maxHeight: '208px',
                                                maxWidth: '100%',
                                                objectFit: 'contain',
                                                borderRadius: '8px',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                                        {data.file.name} ({formatFileSize(data.file.size)})
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '16px 0' }}>
                                    <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '42px', color: '#E4573D' }}></i>
                                    <div className="dz-title" style={{ fontSize: '14px', marginTop: '8px', fontWeight: 600 }}>
                                        {data.file.name}
                                    </div>
                                    <div className="dz-sub" style={{ fontSize: '12px', marginTop: '2px' }}>
                                        Dokumen PDF · {formatFileSize(data.file.size)}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                className="btn-ghost-cancel"
                                style={{
                                    marginTop: '12px',
                                    padding: '6px 16px',
                                    fontSize: '12px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    lineHeight: 1,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                <i className="bi bi-arrow-repeat" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', lineHeight: 1 }}></i>
                                <span>Ganti Berkas</span>
                            </button>
                        </div>
                    ) : (
                        <div className="drop-zone-box" onClick={() => fileInputRef.current?.click()} style={{ padding: '40px 24px' }}>
                            <i className="bi bi-cloud-arrow-up" style={{ fontSize: '36px' }}></i>
                            <div className="dz-title" style={{ fontSize: '14px', marginTop: '6px' }}>
                                Klik atau seret file desain ke sini
                            </div>
                            <div className="dz-sub" style={{ fontSize: '12px' }}>PNG, JPG, atau PDF · Ukuran Maksimal 10MB</div>
                        </div>
                    )}
                    {errors.file && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '6px', textAlign: 'center' }}>
                            {errors.file}
                        </div>
                    )}

                    <div className="modal-grid-2col">
                        <div className="m-field-group">
                            <label>Nama Template <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: Formal Biru"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <span style={{ color: 'red', fontSize: '11px' }}>{errors.name}</span>}
                        </div>

                        <div className="m-field-group">
                            <label>Orientasi</label>
                            <select
                                value={data.orientation}
                                onChange={(e) => setData('orientation', e.target.value as 'landscape' | 'portrait')}
                            >
                                <option value="landscape">Landscape</option>
                                <option value="portrait">Portrait</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions-row">
                        <button className="btn-ghost-cancel" type="button" onClick={handleClose} disabled={processing}>
                            Batal
                        </button>
                        <button className="btn-primary-teal" type="submit" disabled={processing || !data.file}>
                            {processing ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <span
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                            animation: 'spin 0.7s linear infinite',
                                        }}
                                    ></span>
                                    Sedang Proses...
                                </span>
                            ) : (
                                <>
                                    <i className="bi bi-arrow-right"></i> Lanjut Atur Field
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
