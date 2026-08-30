import React, { useState } from 'react';
import { CertificateFormData } from '../../../sertificate';

interface ParticipantFormProps {
    data: CertificateFormData;
    onChange: (field: keyof CertificateFormData, value: any) => void;
    onOpenSigModal: () => void;
    errors?: Record<string, string>;
    isCustomTemplate?: boolean;
}

export function ParticipantForm({
    data,
    onChange,
    onOpenSigModal,
    errors = {},
    isCustomTemplate = false,
}: ParticipantFormProps) {
    const [showExtraFields, setShowExtraFields] = useState<boolean>(false);

    return (
        <div className="panel">
            <div className="panel-head" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="pi">
                        <i className="bi bi-person-lines-fill"></i>
                    </div>
                    <div>
                        <h3>Data Sertifikat</h3>
                        <span className="sub">
                            {isCustomTemplate
                                ? 'Parameter sertifikat: Nama Peserta, Nomor, dan Tanggal'
                                : 'Lengkapi data peserta untuk menerbitkan sertifikat'}
                        </span>
                    </div>
                </div>

                {isCustomTemplate && (
                    <button
                        type="button"
                        onClick={() => setShowExtraFields((prev) => !prev)}
                        style={{
                            fontSize: '11.5px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: '1px solid var(--line)',
                            background: '#fff',
                            color: 'var(--ink-soft)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <i className={`bi ${showExtraFields ? 'bi-chevron-up' : 'bi-sliders'}`}></i>
                        {showExtraFields ? 'Sembunyikan Opsi Lanjutan' : 'Opsi Lanjutan (Judul & TTD)'}
                    </button>
                )}
            </div>

            {/* Nama Lengkap */}
            <div className="field">
                <label>
                    Nama Lengkap <span className="req">*</span>
                </label>
                <div className="input-wrap">
                    <i className="bi bi-person"></i>
                    <input
                        type="text"
                        placeholder="Contoh: Ahmad Fauzan"
                        value={data.participant_name}
                        onChange={(e) => onChange('participant_name', e.target.value)}
                        required
                    />
                </div>
                {errors.participant_name && (
                    <span style={{ color: 'var(--coral)', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                        {errors.participant_name}
                    </span>
                )}
            </div>

            {/* Row 2: Nomor & Tanggal */}
            <div className="row-2">
                <div className="field">
                    <label>
                        Nomor Sertifikat <span className="req">*</span>
                    </label>
                    <div className="input-wrap">
                        <i className="bi bi-hash"></i>
                        <input
                            type="text"
                            placeholder="SG/2026/001"
                            value={data.certificate_number}
                            onChange={(e) => onChange('certificate_number', e.target.value)}
                            required
                        />
                    </div>
                    {errors.certificate_number && (
                        <span style={{ color: 'var(--coral)', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                            {errors.certificate_number}
                        </span>
                    )}
                </div>

                <div className="field">
                    <label>Tanggal Terbit</label>
                    <div className="input-wrap">
                        <i className="bi bi-calendar3"></i>
                        <input
                            type="text"
                            placeholder="25 Agustus 2026"
                            value={data.issue_date}
                            onChange={(e) => onChange('issue_date', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Optional Extra Fields (Shown for Preset Templates or when toggled) */}
            {(!isCustomTemplate || showExtraFields) && (
                <>
                    <div
                        style={{
                            margin: '16px 0 12px 0',
                            paddingTop: '16px',
                            borderTop: '1px dashed var(--line)',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--ink-soft)',
                        }}
                    >
                        Parameter Tambahan (Preset / Lanjutan)
                    </div>

                    {/* Nama Kegiatan */}
                    <div className="field">
                        <label>Nama Kegiatan / Judul</label>
                        <div className="input-wrap">
                            <i className="bi bi-journal-text" style={{ top: '18px' }}></i>
                            <textarea
                                rows={2}
                                placeholder="Contoh: Pelatihan Digital Kominfo"
                                value={data.event_title}
                                onChange={(e) => onChange('event_title', e.target.value)}
                                style={{
                                    width: '100%',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '13.5px',
                                    padding: '10px 14px 10px 40px',
                                    borderRadius: '12px',
                                    border: '1.5px solid var(--line)',
                                    background: '#fff',
                                    color: 'var(--ink)',
                                    outline: 'none',
                                    resize: 'vertical',
                                    minHeight: '64px',
                                }}
                            />
                        </div>
                    </div>

                    {/* Row 2: Penandatangan & Jabatan */}
                    <div className="row-2">
                        <div className="field">
                            <label>Nama Penandatangan</label>
                            <div className="input-wrap">
                                <i className="bi bi-person-badge"></i>
                                <input
                                    type="text"
                                    placeholder="Nama pejabat"
                                    value={data.signatory_name}
                                    onChange={(e) => onChange('signatory_name', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label>Jabatan</label>
                            <div className="input-wrap">
                                <i className="bi bi-briefcase"></i>
                                <input
                                    type="text"
                                    placeholder="Kepala Dinas Kominfo"
                                    value={data.signatory_role}
                                    onChange={(e) => onChange('signatory_role', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Signature Zone */}
                    <div className="field">
                        <label>Tanda Tangan Digital</label>
                        <div className="sig-zone" onClick={onOpenSigModal}>
                            <i className="bi bi-pen"></i>
                            <div className="st">
                                {data.signature_file || data.signature_preview_url
                                    ? '✓ Tanda Tangan Terpasang (Klik untuk Mengubah)'
                                    : 'Unggah gambar TTD atau tanda tangan langsung'}
                            </div>
                            <div className="ss">PNG transparan direkomendasikan</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
