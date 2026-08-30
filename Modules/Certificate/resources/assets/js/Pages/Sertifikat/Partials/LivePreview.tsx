import { router } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import {
    CertificateFormData,
    DEFAULT_PLACEHOLDERS,
    FieldPosition,
    loadGoogleFont,
    PlaceholdersConfig,
    TemplateOption,
    toTitleCaseFont,
} from '../../../sertificate';

interface LivePreviewProps {
    data: CertificateFormData;
    selectedTemplate?: TemplateOption | null;
    onSaveDraft?: () => void;
    onSubmitCertificate?: () => void;
    isSubmitting?: boolean;
}

type FieldKey = keyof PlaceholdersConfig;

const FIELD_LABELS_MAP: Record<FieldKey, string> = {
    participant_name: 'Nama Peserta',
    signatory_name: 'Nama TTD',
    signatory_role: 'Jabatan TTD',
    event_title: 'Judul Kegiatan',
    issue_date: 'Tanggal Terbit',
    certificate_number: 'No. Sertifikat',
};

const PRESET_FONTS = [
    'Poppins',
    'Open Sans',
    'Playfair Display',
    'Roboto',
    'Montserrat',
    'Lato',
    'Great Vibes',
    'Dancing Script',
    'Cinzel',
    'Alex Brush',
    'Merriweather',
    'Oswald',
    'Caveat',
    'Pacifico',
    'EB Garamond',
    'Pinyon Script',
];

export function LivePreview({
    data,
    selectedTemplate,
    onSaveDraft,
    onSubmitCertificate,
    isSubmitting = false,
}: LivePreviewProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const isCustomTemplate = Boolean(selectedTemplate?.file_url);
    const [showOverlay, setShowOverlay] = useState<boolean>(true);
    const [draggingField, setDraggingField] = useState<FieldKey | null>(null);
    const [resizingField, setResizingField] = useState<FieldKey | null>(null);
    const [selectedFieldKey, setSelectedFieldKey] = useState<FieldKey | null>('participant_name');
    const [showCustomFontInput, setShowCustomFontInput] = useState<boolean>(false);

    // Responsive Canvas Stage Width for proportional font size scaling
    const [panelStageWidth, setPanelStageWidth] = useState<number>(450);

    const [initialResizeState, setInitialResizeState] = useState<{
        field: FieldKey;
        startY: number;
        startFontSize: number;
    } | null>(null);

    const [isSavingPositions, setIsSavingPositions] = useState<boolean>(false);
    const [hasUnsavedPositions, setHasUnsavedPositions] = useState<boolean>(false);

    // Toggle visibility for each field on Custom Templates
    const [visibleFields, setVisibleFields] = useState<Record<FieldKey, boolean>>(() => {
        const initialVisible: Record<FieldKey, boolean> = {
            participant_name: true,
            signatory_name: false,
            signatory_role: false,
            event_title: false,
            issue_date: false,
            certificate_number: true,
        };

        if (selectedTemplate?.placeholders) {
            const placeholdersObj = selectedTemplate.placeholders;
            (Object.keys(placeholdersObj) as FieldKey[]).forEach((key) => {
                const config = placeholdersObj[key];
                if (config && config.visible !== undefined) {
                    initialVisible[key] = config.visible;
                }
            });
        }
        return initialVisible;
    });

    const [placeholders, setPlaceholders] = useState<PlaceholdersConfig>(() => {
        return selectedTemplate?.placeholders || DEFAULT_PLACEHOLDERS;
    });

    useEffect(() => {
        if (selectedTemplate?.placeholders) {
            setPlaceholders(selectedTemplate.placeholders);
            const templateVisible: Record<FieldKey, boolean> = {
                participant_name: true,
                signatory_name: false,
                signatory_role: false,
                event_title: false,
                issue_date: false,
                certificate_number: true,
            };
            const placeholdersObj = selectedTemplate.placeholders;
            (Object.keys(placeholdersObj) as FieldKey[]).forEach((key) => {
                const config = placeholdersObj[key];
                if (config && config.visible !== undefined) {
                    templateVisible[key] = config.visible;
                }
            });
            setVisibleFields(templateVisible);
        } else {
            setPlaceholders(DEFAULT_PLACEHOLDERS);
        }
        setHasUnsavedPositions(false);
    }, [selectedTemplate]);

    // Measure stage width to proportionally scale font sizes
    useEffect(() => {
        const updateWidths = () => {
            if (stageRef.current) {
                setPanelStageWidth(stageRef.current.clientWidth || 450);
            }
        };

        updateWidths();
        const timer = setTimeout(updateWidths, 100);
        window.addEventListener('resize', updateWidths);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateWidths);
        };
    }, [selectedTemplate]);

    useEffect(() => {
        // Automatically pre-load Google Fonts used in placeholders
        Object.values(placeholders).forEach((config) => {
            if (config?.fontFamily) {
                loadGoogleFont(config.fontFamily);
            }
        });
    }, [placeholders]);

    const toggleFieldVisibility = (fieldKey: FieldKey) => {
        const nextState = !visibleFields[fieldKey];
        setVisibleFields((prev) => ({
            ...prev,
            [fieldKey]: nextState,
        }));
        updateFieldProp(fieldKey, 'visible', nextState);
    };

    const fontLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCustomFontInputChange = (fieldKey: FieldKey, fontName: string) => {
        setPlaceholders((prev) => ({
            ...prev,
            [fieldKey]: {
                ...(prev[fieldKey] || DEFAULT_PLACEHOLDERS[fieldKey] || { x: 50, y: 50 }),
                fontFamily: fontName,
            },
        }));
        setHasUnsavedPositions(true);

        if (fontLoadTimeoutRef.current) {
            clearTimeout(fontLoadTimeoutRef.current);
        }

        fontLoadTimeoutRef.current = setTimeout(() => {
            if (fontName.trim().length >= 3) {
                loadGoogleFont(fontName);
            }
        }, 450);
    };

    const updateFieldProp = (fieldKey: FieldKey, prop: keyof FieldPosition, value: any) => {
        if (prop === 'fontFamily' && value && value !== '__CUSTOM__' && value.trim().length >= 3) {
            loadGoogleFont(value);
        }
        setPlaceholders((prev) => ({
            ...prev,
            [fieldKey]: {
                ...(prev[fieldKey] || DEFAULT_PLACEHOLDERS[fieldKey] || { x: 50, y: 50 }),
                [prop]: value,
            },
        }));
        setHasUnsavedPositions(true);
    };

    const handleMouseDown = (fieldKey: FieldKey, e: React.MouseEvent) => {
        if (!isCustomTemplate) return;
        e.stopPropagation();
        e.preventDefault();
        setDraggingField(fieldKey);
    };

    const handleResizeStart = (fieldKey: FieldKey, e: React.MouseEvent) => {
        if (!isCustomTemplate) return;
        e.stopPropagation();
        e.preventDefault();
        const currentConfig = placeholders[fieldKey] || DEFAULT_PLACEHOLDERS[fieldKey];
        setInitialResizeState({
            field: fieldKey,
            startY: e.clientY,
            startFontSize: currentConfig?.fontSize || 16,
        });
        setResizingField(fieldKey);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // Handle Font Resizing via Corner Handles
        if (resizingField && initialResizeState) {
            const deltaY = initialResizeState.startY - e.clientY;
            const newFontSize = Math.max(8, Math.min(72, Math.round(initialResizeState.startFontSize + deltaY * 0.35)));

            setPlaceholders((prev) => ({
                ...prev,
                [resizingField]: {
                    ...(prev[resizingField] || DEFAULT_PLACEHOLDERS[resizingField] || { x: 50, y: 50 }),
                    fontSize: newFontSize,
                },
            }));
            setHasUnsavedPositions(true);
            return;
        }

        // Handle Move Dragging
        const activeStage = stageRef.current;
        if (!draggingField || !activeStage) return;
        const rect = activeStage.getBoundingClientRect();
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
        setHasUnsavedPositions(true);
    };

    const handleMouseUp = () => {
        setDraggingField(null);
        setResizingField(null);
        setInitialResizeState(null);
    };

    const handleSaveLayoutPositions = () => {
        if (!selectedTemplate || selectedTemplate.is_preset) return;
        setIsSavingPositions(true);

        router.post(
            `/certificates/templates/${selectedTemplate.id}/placeholders`,
            { placeholders: placeholders as any },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSavingPositions(false);
                    setHasUnsavedPositions(false);
                },
                onError: () => {
                    setIsSavingPositions(false);
                },
            }
        );
    };

    const handleResetLayoutDefault = () => {
        setPlaceholders(DEFAULT_PLACEHOLDERS);
        setVisibleFields({
            participant_name: true,
            signatory_name: false,
            signatory_role: false,
            event_title: false,
            issue_date: false,
            certificate_number: true,
        });
        setHasUnsavedPositions(true);
    };

    // Open Pristine PDF/Full Preview in New Tab Window
    const handleOpenPDFPreviewNewTab = () => {
        const win = window.open('', '_blank');
        if (!win) return;

        // Collect loaded Google Font stylesheet links
        const googleFontLinks = Array.from(document.querySelectorAll('link[id^="google-font-"]'))
            .map((link) => (link as HTMLLinkElement).href);

        const fontStylesheets = googleFontLinks
            .map((href) => `<link rel="stylesheet" href="${href}" />`)
            .join('\n');

        let fieldsHTML = '';
        if (isCustomTemplate) {
            (Object.keys(FIELD_LABELS_MAP) as FieldKey[]).forEach((fKey) => {
                if (!visibleFields[fKey]) return;
                const config = placeholders[fKey] || DEFAULT_PLACEHOLDERS[fieldKeyToPlaceholder(fKey)];
                if (!config) return;

                const fontTitle = toTitleCaseFont(config.fontFamily || 'Poppins');
                const posX = config.x ?? 50;
                // Scale font size proportionally to 980px preview container (reference 800px)
                const scaledFontSize = Math.max(8, Math.round((config.fontSize || 14) * (980 / 800)));
                const val =
                    fKey === 'participant_name'
                        ? data.participant_name || 'Nama Peserta'
                        : fKey === 'event_title'
                        ? data.event_title || 'Pelatihan Transformasi Digital Kominfo 2026'
                        : fKey === 'issue_date'
                        ? data.issue_date || '25 Agustus 2026'
                        : fKey === 'signatory_name'
                        ? data.signatory_name || 'Dr. Siti Rahmawati, M.Kom'
                        : fKey === 'signatory_role'
                        ? data.signatory_role || 'Kepala Dinas Kominfo'
                        : fKey === 'certificate_number'
                        ? `No. ${data.certificate_number || 'SG/2026/0842'}`
                        : '';

                fieldsHTML += `
                    <div style="
                        position: absolute;
                        left: ${posX}%;
                        top: ${config.y}%;
                        transform: translate(-50%, -50%);
                        font-size: ${scaledFontSize}px;
                        color: ${config.color || '#1A1A1A'};
                        font-family: '${fontTitle}', cursive, sans-serif;
                        font-weight: ${config.fontWeight || 'normal'};
                        font-style: ${config.fontStyle || 'normal'};
                        text-align: ${config.textAlign || 'center'};
                        width: max-content;
                        max-width: 85%;
                        white-space: pre-wrap;
                        line-height: 1.35;
                        word-break: break-word;
                    ">
                        ${val}
                    </div>
                `;
            });
        } else {
            fieldsHTML = `
                <div style="position:absolute; top:8%; left:50%; transform:translateX(-50%); text-align:center;">
                    <div style="font-size:12px; letter-spacing:1.5px; text-transform:uppercase; color:#66787B; font-weight:600;">Sertifikat Penghargaan</div>
                    <div style="font-family:'Playfair Display', serif; font-size:24px; font-weight:700; color:#1F2A2E; margin-top:6px;">${data.event_title || 'Pelatihan Transformasi Digital Kominfo 2026'}</div>
                </div>
                <div style="position:absolute; top:42%; left:50%; transform:translate(-50%, -50%); text-align:center;">
                    <div style="font-family:'Playfair Display', serif; font-style:italic; font-size:32px; font-weight:700; color:#2A9D8F; border-bottom:2px solid #FF8C7A; padding-bottom:6px;">
                        ${data.participant_name || 'Nama Peserta'}
                    </div>
                </div>
                <div style="position:absolute; bottom:12%; left:8%; text-align:center;">
                    <div style="font-size:12px; font-weight:600; border-top:1px solid #1F2A2E; padding-top:4px; min-width:100px;">${data.issue_date || '25 Agustus 2026'}</div>
                    <div style="font-size:10px; color:#66787B;">Tanggal Terbit</div>
                </div>
                <div style="position:absolute; bottom:12%; right:8%; text-align:center;">
                    <div style="font-size:12px; font-weight:600; border-top:1px solid #1F2A2E; padding-top:4px; min-width:120px;">${data.signatory_name || 'Dr. Siti Rahmawati, M.Kom'}</div>
                    <div style="font-size:10px; color:#66787B;">${data.signatory_role || 'Kepala Dinas Kominfo'}</div>
                </div>
                <div style="position:absolute; bottom:4%; left:8%; font-size:10px; color:#66787B;">No. ${data.certificate_number || 'SG/2026/0842'}</div>
            `;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8" />
                <title>Pratinjau Sertifikat PDF - ${data.participant_name || 'SerGen'}</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
                ${fontStylesheets}
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        background: #0f172a;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify.content: flex-start;
                        padding: 30px 20px 50px 20px;
                        font-family: 'Poppins', sans-serif;
                    }
                    .top-toolbar {
                        position: fixed;
                        top: 16px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: rgba(255, 255, 255, 0.95);
                        padding: 10px 20px;
                        border-radius: 30px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
                        z-index: 9999;
                        backdrop-filter: blur(10px);
                    }
                    .btn {
                        padding: 8px 18px;
                        border-radius: 20px;
                        border: none;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        text-decoration: none;
                    }
                    .btn-print { background: #2A9D8F; color: #fff; }
                    .btn-close { background: #E2E8F0; color: #475569; }
                    .cert-paper {
                        position: relative;
                        width: 100%;
                        max-width: 980px;
                        aspect-ratio: ${selectedTemplate?.orientation === 'portrait' ? '1 / 1.414' : '1.414 / 1'};
                        background-image: url('${selectedTemplate?.file_url || ''}');
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-color: #fff;
                        border-radius: 12px;
                        box-shadow: 0 30px 70px rgba(0,0,0,0.5);
                        overflow: hidden;
                        margin-top: 54px;
                    }
                    @media print {
                        body { background: #fff; padding: 0; }
                        .top-toolbar { display: none !important; }
                        .cert-paper {
                            width: 100vw;
                            height: 100vh;
                            max-width: none;
                            margin: 0;
                            border-radius: 0;
                            box-shadow: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="top-toolbar">
                    <span style="font-weight:700; color:#1F2A2E; font-size:14px;">📄 Pratinjau PDF Sertifikat (${data.participant_name || 'SerGen'})</span>
                    <button class="btn btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
                    <button class="btn btn-close" onclick="window.close()">✖ Tutup Tab</button>
                </div>
                <div class="cert-paper">
                    ${fieldsHTML}
                </div>
            </body>
            </html>
        `;

        win.document.open();
        win.document.write(htmlContent);
        win.document.close();
    };

    const fieldKeyToPlaceholder = (key: FieldKey): keyof PlaceholdersConfig => key;

    const getCanvasStyle = (): React.CSSProperties => {
        if (selectedTemplate?.file_url) {
            return {
                backgroundImage: `url(${selectedTemplate.file_url})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            };
        }

        if (selectedTemplate?.id === 'preset-sun-gradient') {
            return {
                background: 'linear-gradient(135deg, #FFF9F3 0%, #FFEBE4 100%)',
                border: '6px double #FF8C7A',
            };
        }

        if (selectedTemplate?.id === 'preset-minimal-teal') {
            return {
                background: 'linear-gradient(135deg, #F3FAF9 0%, #E3F3F1 100%)',
                border: '6px double #2A9D8F',
            };
        }

        if (selectedTemplate?.id === 'preset-wisuda-klasik') {
            return {
                background: '#FDFBF7',
                border: '6px double #C98A2E',
            };
        }

        // Default Formal Biru
        return {
            background: 'linear-gradient(135deg, #F8FCFC 0%, #EDF7F6 100%)',
            border: '6px double #CFE0DD',
        };
    };

    const getFieldStyle = (fieldKey: FieldKey): React.CSSProperties => {
        const config = placeholders[fieldKey] || DEFAULT_PLACEHOLDERS[fieldKey];
        if (!config) return {};

        // Scale font size proportionally to current stage container width
        const scaleFactor = (panelStageWidth || 450) / 800;
        const scaledFontSize = Math.max(8, Math.round((config.fontSize || 14) * scaleFactor));

        const isDraggingThis = draggingField === fieldKey;
        const isResizingThis = resizingField === fieldKey;
        const fontTitleName = toTitleCaseFont(config.fontFamily || 'Poppins');
        const posX = config.x ?? 50;

        if (isCustomTemplate) {
            return {
                position: 'absolute',
                left: `${posX}%`,
                top: `${config.y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${scaledFontSize}px`,
                color: config.color || '#1A1A1A',
                fontFamily: `'${fontTitleName}', cursive, sans-serif`,
                fontWeight: config.fontWeight || 'normal',
                fontStyle: config.fontStyle || 'normal',
                textAlign: config.textAlign || 'center',
                width: 'max-content',
                maxWidth: '85%',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.35,
                overflowWrap: 'break-word',
                zIndex: isDraggingThis || isResizingThis ? 20 : 5,
                cursor: isDraggingThis ? 'grabbing' : 'grab',
                padding: '2px 8px',
                borderRadius: '4px',
                userSelect: 'none',
            };
        }

        return {};
    };

    const renderCustomField = (fieldKey: FieldKey, textContent: string) => {
        if (!visibleFields[fieldKey]) return null;

        const isSelected = selectedFieldKey === fieldKey;
        const isDragging = draggingField === fieldKey;
        const isResizing = resizingField === fieldKey;
        const active = isSelected || isDragging || isResizing;

        return (
            <div
                key={fieldKey}
                style={getFieldStyle(fieldKey)}
                onMouseDown={(e) => {
                    setSelectedFieldKey(fieldKey);
                    handleMouseDown(fieldKey, e);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFieldKey(fieldKey);
                }}
                title="Geser teks untuk memindahkan · Tarik sudut lingkaran untuk meresize"
            >
                {textContent}

                {/* Canva Bounding Box Outlines & 4 Corner Handle Dots */}
                {active && (
                    <>
                        <div
                            style={{
                                position: 'absolute',
                                inset: '-4px',
                                border: '1.5px solid #2A9D8F',
                                borderRadius: '4px',
                                pointerEvents: 'none',
                                boxShadow: '0 0 0 2px rgba(42,157,143,0.15)',
                            }}
                        />
                        {/* Top-Left Dot */}
                        <span
                            onMouseDown={(e) => handleResizeStart(fieldKey, e)}
                            title="Tarik untuk meresize ukuran font"
                            style={{
                                position: 'absolute',
                                top: '-7px',
                                left: '-7px',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#fff',
                                border: '2px solid #2A9D8F',
                                cursor: 'nwse-resize',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                                zIndex: 30,
                            }}
                        />
                        {/* Top-Right Dot */}
                        <span
                            onMouseDown={(e) => handleResizeStart(fieldKey, e)}
                            title="Tarik untuk meresize ukuran font"
                            style={{
                                position: 'absolute',
                                top: '-7px',
                                right: '-7px',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#4C6EF5',
                                border: '2px solid #fff',
                                cursor: 'nesw-resize',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                                zIndex: 30,
                            }}
                        />
                        {/* Bottom-Left Dot */}
                        <span
                            onMouseDown={(e) => handleResizeStart(fieldKey, e)}
                            title="Tarik untuk meresize ukuran font"
                            style={{
                                position: 'absolute',
                                bottom: '-7px',
                                left: '-7px',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#4C6EF5',
                                border: '2px solid #fff',
                                cursor: 'nesw-resize',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                                zIndex: 30,
                            }}
                        />
                        {/* Bottom-Right Dot */}
                        <span
                            onMouseDown={(e) => handleResizeStart(fieldKey, e)}
                            title="Tarik untuk meresize ukuran font"
                            style={{
                                position: 'absolute',
                                bottom: '-7px',
                                right: '-7px',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#fff',
                                border: '2px solid #2A9D8F',
                                cursor: 'nwse-resize',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                                zIndex: 30,
                            }}
                        />
                    </>
                )}
            </div>
        );
    };

    // Canva-Style Floating Quick Styling Toolbar Component
    const renderFloatingToolbar = () => {
        if (!selectedFieldKey || !isCustomTemplate || !visibleFields[selectedFieldKey]) return null;

        const currentConfig: FieldPosition = placeholders[selectedFieldKey] || DEFAULT_PLACEHOLDERS[selectedFieldKey] || { x: 50, y: 50 };
        const fontTitle = toTitleCaseFont(currentConfig.fontFamily || 'Poppins');
        const isCurrentFontPreset = PRESET_FONTS.includes(fontTitle);

        return (
            <div
                className="floating-text-toolbar"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid var(--line)',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                }}
            >
                {/* Active Field Badge */}
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--teal-deep)', background: 'var(--teal-soft)', padding: '3px 8px', borderRadius: '6px' }}>
                    {FIELD_LABELS_MAP[selectedFieldKey]}
                </span>

                {/* Font Family Dropdown */}
                <select
                    value={showCustomFontInput || !isCurrentFontPreset ? '__CUSTOM__' : fontTitle}
                    onChange={(e) => {
                        if (e.target.value === '__CUSTOM__') {
                            setShowCustomFontInput(true);
                        } else {
                            setShowCustomFontInput(false);
                            updateFieldProp(selectedFieldKey, 'fontFamily', e.target.value);
                        }
                    }}
                    style={{
                        fontSize: '12px',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--line)',
                        outline: 'none',
                        background: '#FFF',
                        color: 'var(--ink)',
                        cursor: 'pointer',
                        fontWeight: 500,
                    }}
                >
                    {PRESET_FONTS.map((font) => (
                        <option key={font} value={font}>
                            {font}
                        </option>
                    ))}
                    <option value="__CUSTOM__">🔍 Ketik Google Font Custom (Online)...</option>
                </select>

                {/* Custom Google Font Search Input */}
                {(showCustomFontInput || !isCurrentFontPreset) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="bi bi-cloud-arrow-down-fill" style={{ fontSize: '14px', color: 'var(--teal)' }}></i>
                        <input
                            type="text"
                            placeholder="Cth: Open Sans, Great Vibes..."
                            value={currentConfig.fontFamily || ''}
                            onChange={(e) => handleCustomFontInputChange(selectedFieldKey, e.target.value)}
                            onBlur={() => {
                                if (currentConfig.fontFamily && currentConfig.fontFamily.trim().length >= 3) {
                                    loadGoogleFont(currentConfig.fontFamily);
                                }
                            }}
                            style={{
                                fontSize: '12px',
                                padding: '4px 10px',
                                borderRadius: '8px',
                                border: '1.5px solid var(--teal)',
                                outline: 'none',
                                width: '190px',
                                background: '#F0FDF4',
                                color: 'var(--ink)',
                                fontWeight: 500,
                            }}
                            title="Ketik nama font dari fonts.google.com"
                        />
                    </div>
                )}

                {/* Font Size (+/-) */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: '8px', overflow: 'hidden', background: '#FFF' }}>
                    <button
                        type="button"
                        onClick={() => updateFieldProp(selectedFieldKey, 'fontSize', Math.max(8, (currentConfig.fontSize || 14) - 1))}
                        style={{ padding: '4px 10px', border: 'none', background: '#F8FAFC', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
                    >
                        -
                    </button>
                    <span style={{ fontSize: '12px', padding: '0 8px', fontWeight: 600, color: 'var(--ink)' }}>
                        {currentConfig.fontSize || 14}px
                    </span>
                    <button
                        type="button"
                        onClick={() => updateFieldProp(selectedFieldKey, 'fontSize', Math.min(72, (currentConfig.fontSize || 14) + 1))}
                        style={{ padding: '4px 10px', border: 'none', background: '#F8FAFC', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
                    >
                        +
                    </button>
                </div>

                {/* Bold Toggle */}
                <button
                    type="button"
                    onClick={() => updateFieldProp(selectedFieldKey, 'fontWeight', currentConfig.fontWeight === 'bold' ? 'normal' : 'bold')}
                    title="Cetak Tebal (Bold)"
                    style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--line)',
                        background: currentConfig.fontWeight === 'bold' ? 'var(--teal-soft)' : '#fff',
                        color: currentConfig.fontWeight === 'bold' ? 'var(--teal-deep)' : 'var(--ink)',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer',
                    }}
                >
                    B
                </button>

                {/* Italic Toggle */}
                <button
                    type="button"
                    onClick={() => updateFieldProp(selectedFieldKey, 'fontStyle', currentConfig.fontStyle === 'italic' ? 'normal' : 'italic')}
                    title="Cetak Miring (Italic)"
                    style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--line)',
                        background: currentConfig.fontStyle === 'italic' ? 'var(--teal-soft)' : '#fff',
                        color: currentConfig.fontStyle === 'italic' ? 'var(--teal-deep)' : 'var(--ink)',
                        fontStyle: 'italic',
                        fontSize: '13px',
                        cursor: 'pointer',
                    }}
                >
                    I
                </button>

                {/* Align Buttons */}
                <div style={{ display: 'flex', gap: '3px' }}>
                    {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                            key={align}
                            type="button"
                            onClick={() => {
                                updateFieldProp(selectedFieldKey, 'textAlign', align);
                                if (align === 'center') {
                                    updateFieldProp(selectedFieldKey, 'x', 50);
                                }
                            }}
                            title={`Rata ${align}`}
                            style={{
                                padding: '4px 8px',
                                borderRadius: '8px',
                                border: '1px solid var(--line)',
                                background: (currentConfig.textAlign || 'center') === align ? 'var(--teal-soft)' : '#fff',
                                color: (currentConfig.textAlign || 'center') === align ? 'var(--teal-deep)' : 'var(--ink-soft)',
                                fontSize: '13px',
                                cursor: 'pointer',
                            }}
                        >
                            <i className={`bi bi-text-${align}`}></i>
                        </button>
                    ))}
                </div>

                {/* Color Picker & Quick Swatches */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid var(--line)', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Warna:</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {[
                            { hex: '#1A1A1A', title: 'Hitam / Charcoal (Default)' },
                            { hex: '#B8860B', title: 'Emas / Gold' },
                            { hex: '#1B365D', title: 'Navy Formal' },
                            { hex: '#0D5C46', title: 'Hijau Zamrud' },
                            { hex: '#6B1D2F', title: 'Merah Maroon' },
                        ].map((swatch) => (
                            <button
                                key={swatch.hex}
                                type="button"
                                onClick={() => updateFieldProp(selectedFieldKey, 'color', swatch.hex)}
                                title={swatch.title}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: swatch.hex,
                                    border: (currentConfig.color || '#1A1A1A') === swatch.hex ? '2px solid #2A9D8F' : '1px solid #CBD5E1',
                                    cursor: 'pointer',
                                    boxShadow: (currentConfig.color || '#1A1A1A') === swatch.hex ? '0 0 0 2px rgba(42,157,143,0.3)' : 'none',
                                }}
                            />
                        ))}
                    </div>
                    <input
                        type="color"
                        value={currentConfig.color || '#1A1A1A'}
                        onChange={(e) => updateFieldProp(selectedFieldKey, 'color', e.target.value)}
                        style={{ width: '26px', height: '26px', border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'none' }}
                        title="Pilih Warna Custom"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="preview-sticky">
            <div className="panel">
                <div
                    className="panel-head"
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="pi">
                            <i className="bi bi-eye"></i>
                        </div>
                        <div>
                            <h3>Pratinjau Langsung</h3>
                            <span className="sub">
                                {selectedTemplate?.is_preset
                                    ? `Preset: ${selectedTemplate.name}`
                                    : selectedTemplate?.name
                                    ? `Template Custom: ${selectedTemplate.name}`
                                    : 'Tampilan akan diperbarui otomatis'}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {isCustomTemplate && (
                            <button
                                type="button"
                                onClick={handleResetLayoutDefault}
                                title="Reset posisi tata letak ke default (Center)"
                                style={{
                                    fontSize: '11.5px',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--line)',
                                    background: '#fff',
                                    color: 'var(--ink-soft)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 500,
                                }}
                            >
                                <i className="bi bi-arrow-counterclockwise"></i>
                                Reset Posisi
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleOpenPDFPreviewNewTab}
                            title="Buka Pratinjau PDF Sertifikat di Tab Baru"
                            style={{
                                fontSize: '11.5px',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: '1px solid var(--teal)',
                                background: 'var(--teal-soft)',
                                color: 'var(--teal-deep)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: 600,
                            }}
                        >
                            <i className="bi bi-box-arrow-up-right"></i>
                            Pratinjau PDF (Tab Baru)
                        </button>

                        {isCustomTemplate && hasUnsavedPositions && (
                            <button
                                type="button"
                                onClick={handleSaveLayoutPositions}
                                disabled={isSavingPositions}
                                style={{
                                    fontSize: '11.5px',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--teal)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 6px rgba(42,157,143,0.3)',
                                }}
                            >
                                <i className="bi bi-save"></i>
                                {isSavingPositions ? 'Menyimpan...' : 'Simpan Tata Letak'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Floating Formatting Toolbar in Panel */}
                {renderFloatingToolbar()}

                {/* Field Filter Chips for Custom Template */}
                {isCustomTemplate && (
                    <div
                        style={{
                            margin: '-4px 0 12px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexWrap: 'wrap',
                            fontSize: '11px',
                        }}
                    >
                        <span style={{ fontSize: '11px', color: 'var(--ink-faint)', fontWeight: 500 }}>Tampilkan:</span>
                        {(Object.keys(FIELD_LABELS_MAP) as FieldKey[]).map((fKey) => {
                            const active = visibleFields[fKey];
                            return (
                                <button
                                    key={fKey}
                                    type="button"
                                    onClick={() => toggleFieldVisibility(fKey)}
                                    style={{
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        border: active ? '1px solid var(--teal)' : '1px solid var(--line)',
                                        background: active ? 'var(--teal-soft)' : '#fff',
                                        color: active ? 'var(--teal-deep)' : 'var(--ink-soft)',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        fontWeight: active ? 600 : 400,
                                    }}
                                >
                                    {active ? '✓ ' : '+ '}
                                    {FIELD_LABELS_MAP[fKey]}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div
                    className="preview-stage"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div ref={stageRef} className="cert-canvas" style={getCanvasStyle()}>
                        {showOverlay && (
                            <>
                                {!isCustomTemplate && (
                                    <>
                                        <div className="c-badge">
                                            <i className="bi bi-award-fill"></i>
                                        </div>
                                        <div className="c-eyebrow">Sertifikat Penghargaan</div>
                                        <div className="c-title">
                                            {data.event_title || 'Pelatihan Transformasi Digital Kominfo 2026'}
                                        </div>
                                        <div className="c-name">
                                            {data.participant_name || 'Nama Peserta'}
                                        </div>
                                        <div className="c-desc">
                                            Diberikan sebagai bukti telah berpartisipasi dan menyelesaikan seluruh rangkaian kegiatan dengan baik.
                                        </div>

                                        <div className="c-foot">
                                            <div className="fitem">
                                                <div className="fline">{data.issue_date || '25 Agustus 2026'}</div>
                                                <div className="flabel">Tanggal Terbit</div>
                                            </div>
                                            <div className="fitem">
                                                {data.signature_preview_url ? (
                                                    <div style={{ margin: '0 auto 4px auto', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img
                                                            src={data.signature_preview_url}
                                                            alt="TTD"
                                                            style={{ maxHeight: '36px', maxWidth: '120px', objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="fline">{data.signatory_name || 'Dr. Siti Rahmawati, M.Kom'}</div>
                                                )}
                                                <div className="flabel">{data.signatory_role || 'Kepala Dinas Kominfo'}</div>
                                            </div>
                                        </div>

                                        <div className="c-no">
                                            No. {data.certificate_number || 'SG/2026/0842'}
                                        </div>
                                        <div className="c-qr">
                                            <i className="bi bi-qr-code"></i>
                                        </div>
                                    </>
                                )}

                                {/* Custom Template: Draggable + Resizable Corner Handles */}
                                {isCustomTemplate && (
                                    <>
                                        {renderCustomField('event_title', data.event_title || 'Pelatihan Transformasi Digital Kominfo 2026')}
                                        {renderCustomField('participant_name', data.participant_name || 'Nama Peserta')}
                                        {renderCustomField('issue_date', data.issue_date || '25 Agustus 2026')}
                                        {renderCustomField('signatory_name', data.signatory_name || 'Dr. Siti Rahmawati, M.Kom')}
                                        {renderCustomField('signatory_role', data.signatory_role || 'Kepala Dinas Kominfo')}
                                        {renderCustomField('certificate_number', `No. ${data.certificate_number || 'SG/2026/0842'}`)}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="preview-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                        <i className="bi bi-arrows-move"></i> Klik teks untuk mengedit Font (Online Google Fonts), Size, Bold, Italic, & Warna.
                    </span>
                    <button
                        type="button"
                        onClick={handleOpenPDFPreviewNewTab}
                        style={{ border: 'none', background: 'none', color: 'var(--teal-deep)', cursor: 'pointer', fontWeight: 600, fontSize: '11.5px' }}
                    >
                        <i className="bi bi-box-arrow-up-right"></i> Tab Baru (PDF)
                    </button>
                </div>

                <div className="action-bar">
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={onSaveDraft}
                        disabled={isSubmitting}
                    >
                        <i className="bi bi-save2"></i> Simpan Draft
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={onSubmitCertificate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
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
                                Memproses...
                            </span>
                        ) : (
                            <>
                                <i className="bi bi-check2-circle"></i> Terbitkan Sertifikat
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
