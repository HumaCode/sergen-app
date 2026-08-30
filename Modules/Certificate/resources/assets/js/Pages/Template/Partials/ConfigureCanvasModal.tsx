import { router } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    DEFAULT_PLACEHOLDERS,
    FieldPosition,
    loadGoogleFont,
    PlaceholdersConfig,
    TemplateOption,
    toTitleCaseFont,
} from '../../../sertificate';

interface ConfigureCanvasModalProps {
    show: boolean;
    template: TemplateOption | null;
    onClose: () => void;
    onSaved?: (updatedTemplate: TemplateOption) => void;
}

type FieldKey = keyof PlaceholdersConfig;

const FIELD_LABELS: Record<FieldKey, string> = {
    participant_name: 'Nama Peserta',
    event_title: 'Judul Kegiatan',
    certificate_number: 'Nomor Sertifikat',
    issue_date: 'Tanggal Terbit',
    signatory_name: 'Nama Penandatangan',
    signatory_role: 'Jabatan Penandatangan',
};

export function ConfigureCanvasModal({
    show,
    template,
    onClose,
    onSaved,
}: ConfigureCanvasModalProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const [selectedField, setSelectedField] = useState<FieldKey>('participant_name');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [draggingField, setDraggingField] = useState<FieldKey | null>(null);

    const [placeholders, setPlaceholders] = useState<PlaceholdersConfig>(() => {
        return template?.placeholders || DEFAULT_PLACEHOLDERS;
    });

    // Reset when template changes
    React.useEffect(() => {
        if (template?.placeholders) {
            setPlaceholders(template.placeholders);
        } else {
            setPlaceholders(DEFAULT_PLACEHOLDERS);
        }
    }, [template]);

    if (!show || !template) return null;

    const handleFieldPropertyChange = (field: FieldKey, prop: keyof FieldPosition, value: any) => {
        setPlaceholders((prev) => ({
            ...prev,
            [field]: {
                ...(prev[field] || DEFAULT_PLACEHOLDERS[field] || { x: 50, y: 50 }),
                [prop]: value,
            },
        }));
    };

    const handleStageMouseDown = (field: FieldKey, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedField(field);
        setDraggingField(field);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingField || !stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let pctX = Math.round((mouseX / rect.width) * 100);
        let pctY = Math.round((mouseY / rect.height) * 100);

        pctX = Math.max(0, Math.min(100, pctX));
        pctY = Math.max(0, Math.min(100, pctY));

        setPlaceholders((prev) => ({
            ...prev,
            [draggingField]: {
                ...(prev[draggingField] || DEFAULT_PLACEHOLDERS[draggingField] || { x: 50, y: 50 }),
                x: pctX,
                y: pctY,
            },
        }));
    };

    const handleMouseUp = () => {
        setDraggingField(null);
    };

    const handleSave = () => {
        setIsSaving(true);
        router.post(
            `/certificates/templates/${template.id}/placeholders`,
            { placeholders: placeholders as any },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    if (onSaved) onSaved({ ...template, placeholders });
                    onClose();
                },
                onError: () => {
                    setIsSaving(false);
                },
            }
        );
    };

    if (typeof window === 'undefined') return null;

    const activeConfig = placeholders[selectedField] || DEFAULT_PLACEHOLDERS[selectedField] || { x: 50, y: 50, fontSize: 16, color: '#1F2A2E' };

    return createPortal(
        <div
            className={`modal-backdrop-wrap ${show ? 'show' : ''}`}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 26, 25, 0.65)',
                backdropFilter: 'blur(6px)',
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            <div
                className="modal-box-inner"
                onClick={(e) => e.stopPropagation()}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                    background: '#fff',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '1000px',
                    maxHeight: '92vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                }}
            >
                {/* Modal Header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                            <i className="bi bi-sliders" style={{ color: 'var(--teal)', marginRight: '8px' }}></i>
                            Atur Field Canvas — {template.name}
                        </h3>
                        <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>
                            Geser (*drag & drop*) posisi teks di bawah atau sesuaikan koordinat & ukurannya.
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: 'var(--ink-soft)' }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* Modal Body: Editor Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', flex: 1, overflow: 'hidden' }}>
                    {/* Left Canvas Preview Area */}
                    <div
                        style={{
                            padding: '24px 20px 48px 20px',
                            background: '#F3FAF9',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            userSelect: 'none',
                            overflowY: 'auto',
                        }}
                    >
                        <div
                            ref={stageRef}
                            style={{
                                width: '100%',
                                maxWidth: '640px',
                                aspectRatio: template.orientation === 'portrait' ? '2.85/4' : '4/2.85',
                                backgroundImage: template.file_url ? `url(${template.file_url})` : undefined,
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                position: 'relative',
                                borderRadius: '12px',
                                boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                                overflow: 'hidden',
                                border: '2px solid var(--teal)',
                            }}
                        >
                            {(Object.keys(FIELD_LABELS) as FieldKey[]).map((fieldKey) => {
                                const pos = placeholders[fieldKey] || DEFAULT_PLACEHOLDERS[fieldKey] || { x: 50, y: 50 };
                                const isSelected = selectedField === fieldKey;
                                const posX = pos.x ?? 50;

                                return (
                                    <div
                                        key={fieldKey}
                                        onMouseDown={(e) => handleStageMouseDown(fieldKey, e)}
                                        style={{
                                            position: 'absolute',
                                            left: `${posX}%`,
                                            top: `${pos.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                            cursor: 'grab',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: `${Math.max(10, (pos.fontSize || 14) * 0.55)}px`,
                                            color: pos.color || '#1F2A2E',
                                            fontFamily: `'${toTitleCaseFont(pos.fontFamily || 'Poppins')}', cursive, sans-serif`,
                                            textAlign: pos.textAlign || 'center',
                                            background: isSelected ? 'rgba(42, 157, 143, 0.25)' : 'rgba(255, 255, 255, 0.75)',
                                            border: isSelected ? '2px solid var(--teal)' : '1px dashed #66787B',
                                            boxShadow: isSelected ? '0 0 0 4px rgba(42, 157, 143, 0.2)' : 'none',
                                            width: 'max-content',
                                            maxWidth: '85%',
                                            whiteSpace: 'pre-wrap',
                                            lineHeight: 1.35,
                                            overflowWrap: 'break-word',
                                            zIndex: isSelected ? 10 : 2,
                                            fontWeight: isSelected ? 600 : 500,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {FIELD_LABELS[fieldKey]}

                                        {isSelected && (
                                            <>
                                                <span
                                                    title="Tarik untuk mengubah ukuran font"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-6px',
                                                        left: '-6px',
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#fff',
                                                        border: '2px solid var(--teal)',
                                                        cursor: 'nwse-resize',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                                <span
                                                    title="Tarik untuk mengubah ukuran font"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-6px',
                                                        right: '-6px',
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#4C6EF5',
                                                        border: '2px solid #fff',
                                                        cursor: 'nesw-resize',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                                <span
                                                    title="Tarik untuk mengubah ukuran font"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-6px',
                                                        left: '-6px',
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#4C6EF5',
                                                        border: '2px solid #fff',
                                                        cursor: 'nesw-resize',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                                <span
                                                    title="Tarik untuk mengubah ukuran font"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-6px',
                                                        right: '-6px',
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#fff',
                                                        border: '2px solid var(--teal)',
                                                        cursor: 'nwse-resize',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Property Sidebar */}
                    <div style={{ padding: '16px', borderLeft: '1px solid var(--line)', background: '#fff', overflowY: 'auto' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px' }}>
                            Pilih Field yang Diatur:
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                            {(Object.keys(FIELD_LABELS) as FieldKey[]).map((fieldKey) => (
                                <button
                                    key={fieldKey}
                                    type="button"
                                    onClick={() => setSelectedField(fieldKey)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: selectedField === fieldKey ? 'var(--teal)' : 'var(--line)',
                                        background: selectedField === fieldKey ? 'var(--teal-soft)' : '#fff',
                                        color: selectedField === fieldKey ? 'var(--teal-deep)' : 'var(--ink)',
                                        fontSize: '12px',
                                        fontWeight: selectedField === fieldKey ? 600 : 400,
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {FIELD_LABELS[fieldKey]}
                                </button>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '10px' }}>
                                Properti {FIELD_LABELS[selectedField]}:
                            </div>

                            {/* X Position */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                                    Posisi X (%): {activeConfig.x}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={activeConfig.x}
                                    onChange={(e) => handleFieldPropertyChange(selectedField, 'x', Number(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            {/* Y Position */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                                    Posisi Y (%): {activeConfig.y}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={activeConfig.y}
                                    onChange={(e) => handleFieldPropertyChange(selectedField, 'y', Number(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            {/* Font Size */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                                    Ukuran Font: {activeConfig.fontSize || 16}px
                                </label>
                                <input
                                    type="number"
                                    min="8"
                                    max="72"
                                    value={activeConfig.fontSize || 16}
                                    onChange={(e) => handleFieldPropertyChange(selectedField, 'fontSize', Number(e.target.value))}
                                    style={{ width: '100%', padding: '6px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '12px' }}
                                />
                            </div>

                            {/* Text Color */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                                    Warna Teks
                                </label>
                                <input
                                    type="color"
                                    value={activeConfig.color || '#1F2A2E'}
                                    onChange={(e) => handleFieldPropertyChange(selectedField, 'color', e.target.value)}
                                    style={{ width: '100%', height: '32px', border: '1px solid var(--line)', borderRadius: '6px', cursor: 'pointer' }}
                                />
                            </div>

                            {/* Font Family */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--ink-soft)', display: 'block', marginBottom: '4px' }}>
                                    Jenis Font
                                </label>
                                <select
                                    value={activeConfig.fontFamily || 'Poppins'}
                                    onChange={(e) => handleFieldPropertyChange(selectedField, 'fontFamily', e.target.value)}
                                    style={{ width: '100%', padding: '6px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '12px' }}
                                >
                                    <option value="Poppins">Poppins (Sans)</option>
                                    <option value="Playfair Display">Playfair Display (Serif)</option>
                                    <option value="Georgia">Georgia</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--line)', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn-ghost" onClick={onClose} disabled={isSaving}>
                        Batal
                    </button>
                    <button type="button" className="btn-primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Menyimpan...' : 'Simpan Posisi Canvas'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
