import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AddParticipantModal } from './Partials/AddParticipantModal';
import { ParticipantStatCards } from './Partials/ParticipantStatCards';
import { Head, router } from '@inertiajs/react';
import { useState, useCallback, useRef } from 'react';
import '../../css/participant.css';

/* ─── Types ─────────────────────────────────────── */
interface ParticipantItem {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    nik: string | null;
    agency: string | null;
    position: string | null;
    is_active: boolean;
    avatarInitials: string;
    created_at: string;
}

interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

interface PaginatedParticipants {
    data: ParticipantItem[];
    meta: PaginationMeta;
}

interface Stats {
    total: number;
    issued: number;
    pending: number;
    failed: number;
}

interface Filters {
    search?: string;
    batch?: string;
    per_page?: number;
}

interface IndexProps {
    participants: PaginatedParticipants;
    stats: Stats;
    filters: Filters;
}

/* ─── Avatar gradient palette ─────────────────────── */
const AVATAR_GRADIENTS = [
    'linear-gradient(135deg,#2A9D8F,#1E7268)',
    'linear-gradient(135deg,#FF8C7A,#E4573D)',
    'linear-gradient(135deg,#4C6EF5,#3B57D6)',
    'linear-gradient(135deg,#C98A2E,#FFC978)',
    'linear-gradient(135deg,#7950F2,#5F3DC4)',
    'linear-gradient(135deg,#12B886,#099268)',
];

function avatarGradient(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

/* ─── Pagination helper ────────────────────────────── */
function buildPageNumbers(current: number, last: number): (number | '...')[] {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i);
    if (current < last - 2) pages.push('...');
    pages.push(last);
    return pages;
}

/* ─── Component ─────────────────────────────────────── */
export default function Index({ participants, stats, filters }: IndexProps) {
    const { data, meta } = participants;

    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);

    // Local controlled state for search + batch (debounced for search)
    const [searchDraft, setSearchDraft] = useState(filters.search ?? '');
    const [selectedBatch, setSelectedBatch] = useState(filters.batch ?? 'Semua Batch');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ─── Inertia navigation ─── */
    const navigate = useCallback((overrides: Partial<Filters & { page: number }>) => {
        const params: Record<string, string | number | undefined> = {
            search: overrides.search ?? (searchDraft || undefined),
            batch: overrides.batch === 'Semua Batch'
                ? undefined
                : (overrides.batch ?? (selectedBatch !== 'Semua Batch' ? selectedBatch : undefined)),
            per_page: overrides.per_page ?? meta.per_page,
            page: overrides.page ?? 1,
        };
        // Strip undefined keys
        const clean = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
        ) as Record<string, string | number>;

        router.get(window.location.pathname, clean, { preserveState: true, replace: true });
    }, [searchDraft, selectedBatch, meta.per_page]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchDraft(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            navigate({ search: val, page: 1 });
        }, 400);
    };

    const handleBatchChange = (batch: string) => {
        setSelectedBatch(batch);
        navigate({ batch, page: 1 });
    };

    const handleReset = () => {
        setSearchDraft('');
        setSelectedBatch('Semua Batch');
        navigate({ search: '', batch: 'Semua Batch', page: 1 });
    };

    const handlePage = (page: number) => {
        if (page < 1 || page > meta.last_page) return;
        navigate({ page });
    };

    /* ─── Checkbox ─── */
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRows(e.target.checked ? data.map((p) => p.id) : []);
    };

    const handleRowSelect = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
        );
    };

    /* ─── Render ─── */
    const batchChips = ['Semua Batch', 'Pelatihan Digital Kominfo', 'Workshop UMKM Batik', 'Webinar SPBE 2026', 'Sertifikasi Keamanan Data'];
    const isFiltered = selectedBatch !== 'Semua Batch' || searchDraft !== '';

    return (
        <AuthenticatedLayout>
            <Head title="Peserta — SerGen" />

            <AddParticipantModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
            />

            {/* Page Header */}
            <div className="page-head">
                <div>
                    <h1>Peserta</h1>
                    <p>Kelola seluruh data peserta dari semua batch sertifikat.</p>
                </div>
                <div className="head-actions">
                    <button className="btn-ghost" type="button">
                        <i className="bi bi-file-earmark-spreadsheet"></i> Import Excel
                    </button>
                    <button
                        className="btn-primary"
                        type="button"
                        onClick={() => setShowAddModal(true)}
                    >
                        <i className="bi bi-plus-lg"></i> Tambah Peserta
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <ParticipantStatCards
                total={stats.total}
                issued={stats.issued}
                pending={stats.pending}
                failed={stats.failed}
            />

            {/* Toolbar */}
            <div className="toolbar">
                <div className="chip-row">
                    {batchChips.map((chip) => (
                        <div
                            key={chip}
                            className={`chip ${selectedBatch === chip ? 'active' : ''}`}
                            onClick={() => handleBatchChange(chip)}
                        >
                            {chip}
                        </div>
                    ))}

                    {isFiltered && (
                        <button
                            className="btn-reset-filter"
                            type="button"
                            onClick={handleReset}
                            title="Reset Filter"
                        >
                            <i className="bi bi-x-circle-fill"></i> Reset Filter
                        </button>
                    )}
                </div>
                <div className="local-search">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau NIK..."
                        value={searchDraft}
                        onChange={handleSearchChange}
                    />
                    {searchDraft !== '' && (
                        <button
                            className="btn-clear-search"
                            type="button"
                            onClick={() => { setSearchDraft(''); navigate({ search: '', page: 1 }); }}
                            title="Hapus pencarian"
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Table Panel */}
            <div className="panel participant-panel">
                <table className="ptbl">
                    <thead>
                        <tr>
                            <th className="chk">
                                <input
                                    type="checkbox"
                                    className="rowchk"
                                    checked={selectedRows.length === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Peserta</th>
                            <th>Organisasi / Jabatan</th>
                            <th>Terdaftar</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-faint)' }}>
                                    <i className="bi bi-inbox" style={{ fontSize: 28, display: 'block', marginBottom: 8 }}></i>
                                    Tidak ada data peserta ditemukan.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td className="chk">
                                        <input
                                            type="checkbox"
                                            className="rowchk"
                                            checked={selectedRows.includes(item.id)}
                                            onChange={() => handleRowSelect(item.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="p-name">
                                            <div
                                                className="p-avatar"
                                                style={{ background: avatarGradient(item.id) }}
                                            >
                                                {item.avatarInitials}
                                            </div>
                                            <div className="pn-txt">
                                                <div className="pnn">{item.name}</div>
                                                <div className="pne" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                    <span>{item.email ?? '—'}</span>
                                                    {item.nik && (
                                                        <span style={{ opacity: 0.75, fontSize: '11px', background: 'rgba(0,0,0,0.04)', padding: '1px 6px', borderRadius: '4px' }}>
                                                            NIK: {item.nik}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="pn-txt">
                                            <div className="pnn" style={{ fontSize: 13 }}>{item.agency ?? '—'}</div>
                                            <div className="pne">{item.position ?? '—'}</div>
                                        </div>
                                    </td>
                                    <td>{item.created_at}</td>
                                    <td>
                                        <span className={`pill ${item.is_active ? 'done' : 'failed'}`}>
                                            <i className={`bi ${item.is_active ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button title="Lihat" type="button">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button title="Edit" type="button">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-bar">
                    <div className="pinfo">
                        {meta.total > 0
                            ? <>Menampilkan <b>{meta.from}–{meta.to}</b> dari <b>{meta.total.toLocaleString('id-ID')}</b> peserta</>
                            : 'Tidak ada data'}
                    </div>
                    <div className="pager">
                        <button
                            type="button"
                            disabled={meta.current_page === 1}
                            onClick={() => handlePage(meta.current_page - 1)}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        {buildPageNumbers(meta.current_page, meta.last_page).map((page, idx) =>
                            page === '...'
                                ? <button key={`ellipsis-${idx}`} type="button" disabled>…</button>
                                : (
                                    <button
                                        key={page}
                                        type="button"
                                        className={meta.current_page === page ? 'active' : ''}
                                        onClick={() => handlePage(page as number)}
                                    >
                                        {page}
                                    </button>
                                )
                        )}

                        <button
                            type="button"
                            disabled={meta.current_page === meta.last_page}
                            onClick={() => handlePage(meta.current_page + 1)}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
