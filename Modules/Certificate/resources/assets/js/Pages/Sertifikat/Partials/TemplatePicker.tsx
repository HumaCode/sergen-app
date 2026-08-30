import React, { useState } from 'react';
import { SYSTEM_PRESETS, TemplateOption } from '../../../sertificate';

interface TemplatePickerProps {
    templates?: TemplateOption[] | { data?: TemplateOption[] };
    selectedTemplateId: string;
    onSelectTemplate: (template: TemplateOption) => void;
}

export function TemplatePicker({
    templates = [],
    selectedTemplateId,
    onSelectTemplate,
}: TemplatePickerProps) {
    const [filterCategory, setFilterCategory] = useState<'all' | 'preset' | 'custom'>('all');

    // Safely extract custom templates array (handles plain arrays or Inertia ResourceCollection objects { data: [...] })
    const customList: TemplateOption[] = Array.isArray(templates)
        ? templates
        : Array.isArray((templates as any)?.data)
        ? (templates as any).data
        : [];

    // Combine system presets and database custom templates
    const combinedTemplates: TemplateOption[] = [
        ...SYSTEM_PRESETS,
        ...customList.map((t) => ({ ...t, is_preset: false })),
    ];

    const filteredTemplates = combinedTemplates.filter((t) => {
        if (filterCategory === 'preset') return t.is_preset;
        if (filterCategory === 'custom') return !t.is_preset;
        return true;
    });

    const getPaletteClass = (index: number, customClass?: string) => {
        if (customClass) return customClass;
        const classes = ['p1', 'p2', 'p3'];
        return classes[index % classes.length];
    };

    const getIconClass = (index: number) => {
        const icons = ['bi-award-fill', 'bi-stars', 'bi-patch-check-fill', 'bi-mortarboard-fill'];
        return icons[index % icons.length];
    };

    return (
        <div className="panel">
            <div className="panel-head" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="pi">
                        <i className="bi bi-file-earmark-image"></i>
                    </div>
                    <div>
                        <h3>Template Sertifikat</h3>
                        <span className="sub">Pilih preset bawaan sistem atau template custom hasil unggahan</span>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '4px', background: 'var(--sky)', padding: '3px', borderRadius: '10px', border: '1px solid var(--line)' }}>
                    <button
                        type="button"
                        onClick={() => setFilterCategory('all')}
                        style={{
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            fontWeight: filterCategory === 'all' ? 600 : 400,
                            borderRadius: '7px',
                            border: 'none',
                            background: filterCategory === 'all' ? '#fff' : 'transparent',
                            color: filterCategory === 'all' ? 'var(--teal-deep)' : 'var(--ink-soft)',
                            boxShadow: filterCategory === 'all' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Semua ({combinedTemplates.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterCategory('preset')}
                        style={{
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            fontWeight: filterCategory === 'preset' ? 600 : 400,
                            borderRadius: '7px',
                            border: 'none',
                            background: filterCategory === 'preset' ? '#fff' : 'transparent',
                            color: filterCategory === 'preset' ? 'var(--teal-deep)' : 'var(--ink-soft)',
                            boxShadow: filterCategory === 'preset' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Preset System ({SYSTEM_PRESETS.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterCategory('custom')}
                        style={{
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            fontWeight: filterCategory === 'custom' ? 600 : 400,
                            borderRadius: '7px',
                            border: 'none',
                            background: filterCategory === 'custom' ? '#fff' : 'transparent',
                            color: filterCategory === 'custom' ? 'var(--teal-deep)' : 'var(--ink-soft)',
                            boxShadow: filterCategory === 'custom' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Custom ({customList.length})
                    </button>
                </div>
            </div>

            <div className="tpl-picker">
                {filteredTemplates.map((tpl, idx) => {
                    const isSelected = selectedTemplateId === tpl.id || (!selectedTemplateId && idx === 0);
                    const palette = getPaletteClass(idx, tpl.palette_class);
                    const icon = getIconClass(idx);

                    return (
                        <div
                            key={tpl.id}
                            className={`tpl-pick ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelectTemplate(tpl)}
                            style={{ position: 'relative' }}
                        >
                            {/* Badge System vs Custom */}
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    fontSize: '9.5px',
                                    fontWeight: 600,
                                    padding: '1px 6px',
                                    borderRadius: '10px',
                                    background: tpl.is_preset ? 'var(--teal)' : '#4C6EF5',
                                    color: '#fff',
                                    zIndex: 2,
                                }}
                            >
                                {tpl.is_preset ? 'System' : 'Custom'}
                            </span>

                            <div
                                className={`thumb ${palette}`}
                                style={tpl.file_url ? { backgroundImage: `url(${tpl.file_url})` } : undefined}
                            >
                                {!tpl.file_url && <i className={`bi ${icon}`}></i>}
                            </div>
                            <div className="tname" title={tpl.name}>{tpl.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
