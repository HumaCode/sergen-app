import { useForm, router } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TemplateItem } from './TemplateCard';

interface EditTemplateModalProps {
    show: boolean;
    template: TemplateItem | null;
    onClose: () => void;
    onSuccessNotification?: (message: string) => void;
}

export function EditTemplateModal({ show, template, onClose, onSuccessNotification }: EditTemplateModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newFilePreviewUrl, setNewFilePreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        _method: string;
        name: string;
        orientation: 'landscape' | 'portrait';
        is_active: boolean;
        file: File | null;
    }>({
        _method: 'POST',
        name: '',
        orientation: 'landscape',
        is_active: true,
        file: null,
    });

    useEffect(() => {
        if (template && show) {
            setData({
                _method: 'POST',
                name: template.name,
                orientation: template.orientation.toLowerCase() as 'landscape' | 'portrait',
                is_active: template.is_active,
                file: null,
            });
            setNewFilePreviewUrl(null);
        }
    }, [template, show]);

    useEffect(() => {
        if (data.file && data.file.type.startsWith('image/')) {
            const url = URL.createObjectURL(data.file);
            setNewFilePreviewUrl(url);

            // Auto detect new image orientation
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
            setNewFilePreviewUrl(null);
        }
    }, [data.file]);

    if (!show || !template) return null;

    const handleClose = () => {
        reset();
        setNewFilePreviewUrl(null);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedName = data.name;
        post(`/certificates/templates/${template.id}`, {
            forceFormData: true,
            onSuccess: () => {
                handleClose();
                if (onSuccessNotification) {
                    onSuccessNotification(`Template "${updatedName}" berhasil diperbarui!`);
                }
            },
            onError: (errs) => {
                console.error('Update Template Errors:', errs);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const formatFileSize = (bytes?: number | null) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const isExistingImage = template.file_url && (!template.mime_type || template.mime_type.startsWith('image/'));

    if (typeof window === 'undefined') return null;

    return createPortal(
        <div className={`modal-backdrop-wrap ${show ? 'show' : ''}`} onClick={handleClose}>
            <div className="modal-box-inner modal-xxl" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head-row">
                    <h3>Edit Template Sertifikat</h3>
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

                    {/* Preview Box */}
                    <div
                        className="drop-zone-box"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            padding: '20px',
                            cursor: 'pointer',
                            borderColor: 'var(--teal)',
                            background: 'var(--teal-soft)',
                            borderStyle: 'solid',
                        }}
                    >
                        {data.file ? (
                            newFilePreviewUrl ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <div
                                        style={{
                                            maxHeight: '180px',
                                            maxWidth: '100%',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                                            background: '#fff',
                                            padding: '4px',
                                        }}
                                    >
                                        <img
                                            src={newFilePreviewUrl}
                                            alt="Preview Baru"
                                            style={{ maxHeight: '170px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                                        Baru: {data.file.name} ({formatFileSize(data.file.size)})
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '12px 0' }}>
                                    <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '38px', color: '#E4573D' }}></i>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, marginTop: '4px' }}>{data.file.name}</div>
                                    <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)' }}>
                                        Dokumen PDF · {formatFileSize(data.file.size)}
                                    </div>
                                </div>
                            )
                        ) : template.file_url ? (
                            isExistingImage ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <div
                                        style={{
                                            maxHeight: '180px',
                                            maxWidth: '100%',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                                            background: '#fff',
                                            padding: '4px',
                                        }}
                                    >
                                        <img
                                            src={template.file_url}
                                            alt={template.name}
                                            style={{ maxHeight: '170px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                                        File Desain Saat Ini: <strong style={{ color: 'var(--ink)' }}>{template.file_name || template.name}</strong> ({formatFileSize(template.file_size)})
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '12px 0' }}>
                                    <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '38px', color: '#E4573D' }}></i>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, marginTop: '4px' }}>{template.file_name || template.name}</div>
                                    <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)' }}>
                                        Dokumen PDF Saat Ini · {formatFileSize(template.file_size)}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div>
                                <i className="bi bi-cloud-arrow-up" style={{ fontSize: '32px', color: 'var(--teal)' }}></i>
                                <div className="dz-title" style={{ fontSize: '13px', marginTop: '4px', fontWeight: 600 }}>
                                    Klik untuk mengunggah berkas desain
                                </div>
                                <div className="dz-sub" style={{ fontSize: '11.5px' }}>PNG, JPG, atau PDF</div>
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
                            <span>{data.file ? 'Ganti Berkas Lagi' : 'Ganti Berkas Desain'}</span>
                        </button>
                    </div>

                    {errors.file && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '6px', textAlign: 'center' }}>
                            {errors.file}
                        </div>
                    )}

                    <div className="modal-grid-2col" style={{ marginTop: '16px' }}>
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

                    <div className="m-field-group" style={{ marginTop: '16px' }}>
                        <label>Status Template</label>
                        <div className="status-radio-group">
                            <div
                                className={`status-radio-card ${data.is_active ? 'active-option' : ''}`}
                                onClick={() => setData('is_active', true)}
                            >
                                <div className="radio-indicator"></div>
                                <div className="card-text">
                                    <div className="label-title">
                                        <i className="bi bi-check-circle-fill" style={{ color: 'var(--teal)' }}></i> Aktif
                                    </div>
                                    <div className="label-desc">Dapat digunakan untuk menerbitkan sertifikat</div>
                                </div>
                            </div>

                            <div
                                className={`status-radio-card ${!data.is_active ? 'inactive-option' : ''}`}
                                onClick={() => setData('is_active', false)}
                            >
                                <div className="radio-indicator"></div>
                                <div className="card-text">
                                    <div className="label-title">
                                        <i className="bi bi-slash-circle-fill" style={{ color: '#E4573D' }}></i> Nonaktif
                                    </div>
                                    <div className="label-desc">Disembunyikan sementara dari sistem</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions-row" style={{ marginTop: '20px' }}>
                        <button className="btn-ghost-cancel" type="button" onClick={handleClose} disabled={processing}>
                            Batal
                        </button>
                        <button className="btn-primary-teal" type="submit" disabled={processing}>
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
                                    Sedang Menyimpan...
                                </span>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg"></i> Simpan Perubahan
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
