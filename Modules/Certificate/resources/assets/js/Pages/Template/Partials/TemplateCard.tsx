import { useState, useRef, useEffect } from 'react';

export interface TemplateItem {
    id: string;
    name: string;
    file_url?: string | null;
    file_name?: string | null;
    file_size?: number | null;
    mime_type?: string | null;
    orientation: string;
    is_active: boolean;
    dimension: string;
    used_batches_count: number;
    palette_class: string;
    created_at: string;
}

interface TemplateCardProps {
    template: TemplateItem;
    onEdit?: (template: TemplateItem) => void;
    onDelete?: (template: TemplateItem) => void;
    onToggleStatus?: (template: TemplateItem, onFinish?: () => void) => void;
    onConfigureCanvas?: (template: TemplateItem) => void;
}

const RIBBON_ICONS = [
    { icon: 'bi-award-fill', color: '#2A9D8F' },
    { icon: 'bi-stars', color: '#FF8C7A' },
    { icon: 'bi-patch-check-fill', color: '#4C6EF5' },
    { icon: 'bi-mortarboard-fill', color: '#C98A2E' },
    { icon: 'bi-shield-check', color: '#2A9D8F' },
    { icon: 'bi-briefcase-fill', color: '#FF8C7A' },
];

function getRibbonStyle(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return RIBBON_ICONS[Math.abs(hash) % RIBBON_ICONS.length];
}

export function TemplateCard({ template, onEdit, onDelete, onToggleStatus, onConfigureCanvas }: TemplateCardProps) {
    const ribbon = getRibbonStyle(template.id);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const isImage = !template.mime_type || template.mime_type.startsWith('image/');

    const handleToggleStatusClick = () => {
        if (onToggleStatus) {
            setIsTogglingStatus(true);
            onToggleStatus(template, () => {
                setIsTogglingStatus(false);
                setDropdownOpen(false);
            });
        }
    };

    return (
        <div className={`tpl-card ${dropdownOpen ? 'menu-active' : ''}`}>
            <div className={`tpl-thumb-wrap ${template.palette_class}`} style={{ position: 'relative' }}>
                {template.file_url && isImage ? (
                    <img
                        src={template.file_url}
                        alt={template.name}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '16px 16px 0 0',
                            zIndex: 1,
                        }}
                    />
                ) : (
                    <div className="tpl-mock" style={{ zIndex: 1, borderRadius: '16px 16px 0 0' }}>
                        <i className={`bi ${ribbon.icon} ribbon-icon`} style={{ color: ribbon.color }}></i>
                        <div className="ln title"></div>
                        <div className="ln w60"></div>
                        <div className="ln w40"></div>
                    </div>
                )}

                <span className={`tpl-status ${template.is_active ? 'active' : 'inactive'}`} style={{ zIndex: 5 }}>
                    <span className="dotpoint"></span> {template.is_active ? 'Aktif' : 'Nonaktif'}
                </span>

                <div ref={menuRef} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                    <button
                        className={`tpl-menu-btn ${dropdownOpen ? 'open' : ''}`}
                        type="button"
                        title="Menu Opsi"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        style={{ position: 'relative', top: 0, right: 0 }}
                    >
                        <i className="bi bi-three-dots"></i>
                    </button>

                    {dropdownOpen && (
                        <div className="tpl-dropdown-menu" style={{ top: '36px', right: 0 }}>
                            <button
                                className="tpl-dropdown-item"
                                type="button"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    if (onConfigureCanvas) onConfigureCanvas(template);
                                }}
                            >
                                <i className="bi bi-sliders"></i> Atur Field Canvas
                            </button>
                            <button
                                className="tpl-dropdown-item"
                                type="button"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    if (onEdit) onEdit(template);
                                }}
                            >
                                <i className="bi bi-pencil"></i> Edit Template
                            </button>
                            <button
                                className="tpl-dropdown-item"
                                type="button"
                                disabled={isTogglingStatus}
                                onClick={handleToggleStatusClick}
                            >
                                {isTogglingStatus ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                        <span
                                            style={{
                                                width: '14px',
                                                height: '14px',
                                                border: '2px solid var(--teal)',
                                                borderTopColor: 'transparent',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                                animation: 'spin 0.7s linear infinite',
                                            }}
                                        ></span>
                                        <span>Memproses...</span>
                                    </span>
                                ) : (
                                    <>
                                        <i className={`bi ${template.is_active ? 'bi-toggle-off' : 'bi-toggle-on'}`}></i>
                                        {template.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                    </>
                                )}
                            </button>
                            
                            <div className="tpl-dropdown-divider"></div>

                            <button
                                className="tpl-dropdown-item danger"
                                type="button"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    if (onDelete) onDelete(template);
                                }}
                            >
                                <i className="bi bi-trash"></i> Hapus Template
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="tpl-body">
                <div className="tname">{template.name}</div>
                <div className="tmeta">
                    <span>{template.orientation}</span>
                    <span className="dividerdot"></span>
                    <span>{template.dimension}</span>
                </div>
            </div>

            <div className="tpl-footer">
                <div className="used">
                    <i className="bi bi-layers"></i> {template.used_batches_count} batch
                </div>
                <a className="edit-link" href="#">
                    Atur field <i className="bi bi-arrow-right"></i>
                </a>
            </div>
        </div>
    );
}
