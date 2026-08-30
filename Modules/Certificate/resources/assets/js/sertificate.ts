export interface FieldPosition {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    fontSize?: number; // px
    color?: string; // hex
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | number;
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right';
    visible?: boolean;
}

export interface PlaceholdersConfig {
    participant_name?: FieldPosition;
    event_title?: FieldPosition;
    certificate_number?: FieldPosition;
    issue_date?: FieldPosition;
    signatory_name?: FieldPosition;
    signatory_role?: FieldPosition;
}

export interface TemplateOption {
    id: string;
    name: string;
    file_url?: string | null;
    palette_class?: string;
    orientation?: string;
    is_preset?: boolean;
    placeholders?: PlaceholdersConfig | null;
}

export interface CertificateFormData {
    template_id: string;
    participant_name: string;
    certificate_number: string;
    issue_date: string;
    event_title: string;
    signatory_name: string;
    signatory_role: string;
    signature_file: File | null;
    signature_preview_url: string | null;
}

export interface StepItem {
    id: number;
    title: string;
    icon?: string;
}

export const DEFAULT_PLACEHOLDERS: PlaceholdersConfig = {
    participant_name: { x: 50, y: 50, fontSize: 28, color: '#1A1A1A', fontFamily: 'Poppins', textAlign: 'center' },
    event_title: { x: 50, y: 32, fontSize: 18, color: '#1A1A1A', fontFamily: 'Poppins', textAlign: 'center' },
    certificate_number: { x: 12, y: 92, fontSize: 10, color: '#555555', fontFamily: 'Poppins', textAlign: 'left' },
    issue_date: { x: 35, y: 82, fontSize: 11, color: '#1A1A1A', fontFamily: 'Poppins', textAlign: 'center' },
    signatory_name: { x: 68, y: 82, fontSize: 11, color: '#1A1A1A', fontFamily: 'Poppins', textAlign: 'center' },
    signatory_role: { x: 68, y: 87, fontSize: 10, color: '#555555', fontFamily: 'Poppins', textAlign: 'center' },
};

export const SYSTEM_PRESETS: TemplateOption[] = [
    {
        id: 'preset-formal-biru',
        name: 'Formal Biru',
        palette_class: 'p1',
        orientation: 'landscape',
        is_preset: true,
    },
    {
        id: 'preset-sun-gradient',
        name: 'Sun Gradient',
        palette_class: 'p2',
        orientation: 'landscape',
        is_preset: true,
    },
    {
        id: 'preset-minimal-teal',
        name: 'Minimal Teal',
        palette_class: 'p3',
        orientation: 'landscape',
        is_preset: true,
    },
    {
        id: 'preset-wisuda-klasik',
        name: 'Wisuda Klasik',
        palette_class: 'p1',
        orientation: 'landscape',
        is_preset: true,
    },
];

export const INITIAL_FORM_DATA: CertificateFormData = {
    template_id: SYSTEM_PRESETS[0].id,
    participant_name: 'Ahmad Fauzan',
    certificate_number: 'SG/2026/0842',
    issue_date: '25 Agustus 2026',
    event_title: 'Pelatihan Transformasi Digital Kominfo 2026',
    signatory_name: 'Dr. Siti Rahmawati, M.Kom',
    signatory_role: 'Kepala Dinas Kominfo',
    signature_file: null,
    signature_preview_url: null,
};

export const DEFAULT_STEPS: StepItem[] = [
    { id: 1, title: 'Pilih Template' },
    { id: 2, title: 'Isi Data' },
    { id: 3, title: 'Preview & Terbitkan' },
];

export function generateRandomCertNumber(): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `SG/2026/${randomNum}`;
}

export function formatDateIndonesian(dateString?: string): string {
    if (!dateString) return '25 Agustus 2026';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function toTitleCaseFont(str: string): string {
    if (!str) return 'Poppins';
    return str
        .trim()
        .toLowerCase()
        .replace(/(?:^|\s|-)\S/g, (a) => a.toUpperCase());
}

const loadedGoogleFonts = new Set<string>();

export function loadGoogleFont(fontName: string) {
    if (!fontName || typeof document === 'undefined') return;

    const cleanFontName = toTitleCaseFont(fontName);
    if (!cleanFontName || cleanFontName.length < 3 || loadedGoogleFonts.has(cleanFontName)) return;

    const systemFonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'sans-serif', 'serif'];
    if (systemFonts.includes(cleanFontName)) return;

    try {
        const formattedName = cleanFontName.replace(/\s+/g, '+');
        const linkId = `google-font-${formattedName.toLowerCase()}`;

        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${formattedName}&display=swap`;
            document.head.appendChild(link);
            loadedGoogleFonts.add(cleanFontName);
        }
    } catch (e) {
        console.warn('Failed to load Google Font:', cleanFontName, e);
    }
}
