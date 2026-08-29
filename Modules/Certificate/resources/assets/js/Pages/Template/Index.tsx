import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ConfirmDeleteModal } from '@/Components/ConfirmDeleteModal';
import { EmptyState } from '@/Components/EmptyState';
import { Toast, ToastType } from '@/Components/Toast';
import { Head, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import '../../../css/template.css';
import { AddTemplateCard } from './Partials/AddTemplateCard';
import { TemplateCard, TemplateItem } from './Partials/TemplateCard';
import { TemplateToolbar } from './Partials/TemplateToolbar';
import { UploadTemplateModal } from './Partials/UploadTemplateModal';
import { EditTemplateModal } from './Partials/EditTemplateModal';

interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

interface PaginatedTemplates {
    data: TemplateItem[];
    meta: PaginationMeta;
}

interface StatsSummary {
    total: number;
    active: number;
    inactive: number;
    landscape: number;
    portrait: number;
}

interface Filters {
    search?: string;
    status?: string;
    orientation?: string;
    per_page?: number;
}

interface IndexProps {
    templates: PaginatedTemplates;
    stats: StatsSummary;
    filters: Filters;
}

export default function Index({ templates, stats, filters }: IndexProps) {
    const { data: serverData, meta } = templates;
    const dataList = serverData ?? [];

    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');
    const [orientationFilter, setOrientationFilter] = useState(filters.orientation ?? 'all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
    const [deletingTemplate, setDeletingTemplate] = useState<TemplateItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [toastState, setToastState] = useState<{
        show: boolean;
        type: ToastType;
        message: string;
    }>({
        show: false,
        type: 'success',
        message: '',
    });

    const triggerToast = (message: string, type: ToastType = 'success') => {
        setToastState({ show: true, message, type });
    };

    const navigate = useCallback((overrides: Partial<Filters & { page: number }>) => {
        const params: Record<string, string | number | undefined> = {
            status: overrides.status ?? (statusFilter !== 'all' ? statusFilter : undefined),
            orientation: overrides.orientation ?? (orientationFilter !== 'all' ? orientationFilter : undefined),
            per_page: overrides.per_page ?? meta?.per_page ?? 12,
            page: overrides.page ?? 1,
        };
        const clean = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
        ) as Record<string, string | number>;

        router.get(window.location.pathname, clean, { preserveState: true, replace: true });
    }, [statusFilter, orientationFilter, meta?.per_page]);

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        navigate({ status, page: 1 });
    };

    const handleOrientationChange = (orientation: string) => {
        setOrientationFilter(orientation);
        navigate({ orientation, page: 1 });
    };

    const handleConfirmDelete = () => {
        if (!deletingTemplate) return;
        const target = deletingTemplate;
        router.delete(`/certificates/templates/${target.id}`, {
            onStart: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setDeletingTemplate(null);
            },
            onSuccess: () => {
                router.visit(window.location.href, { preserveScroll: true, replace: true });
                triggerToast(`Template "${target.name}" berhasil dihapus!`, 'danger');
            },
        });
    };

    const handleToggleStatus = (tpl: TemplateItem, onFinish?: () => void) => {
        const newStatus = !tpl.is_active;
        router.post(
            `/certificates/templates/${tpl.id}`,
            {
                _method: 'POST',
                name: tpl.name,
                orientation: tpl.orientation.toLowerCase(),
                is_active: newStatus,
            },
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    triggerToast(
                        `Template "${tpl.name}" berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}!`,
                        newStatus ? 'success' : 'info'
                    );
                },
                onFinish: () => {
                    if (onFinish) onFinish();
                },
            }
        );
    };

    const effectiveStats = stats || {
        total: dataList.length,
        active: dataList.filter(t => t.is_active).length,
        inactive: dataList.filter(t => !t.is_active).length,
        landscape: dataList.filter(t => t.orientation.toLowerCase() === 'landscape').length,
        portrait: dataList.filter(t => t.orientation.toLowerCase() === 'portrait').length,
    };

    const filteredData = dataList.filter((item) => {
        if (statusFilter === 'active' && !item.is_active) return false;
        if (statusFilter === 'inactive' && item.is_active) return false;
        if (orientationFilter === 'landscape' && item.orientation.toLowerCase() !== 'landscape') return false;
        if (orientationFilter === 'portrait' && item.orientation.toLowerCase() !== 'portrait') return false;
        return true;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Template Sertifikat" />

            <Toast
                show={toastState.show}
                type={toastState.type}
                message={toastState.message}
                onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
            />

            <div className="template-page-head">
                <div>
                    <h1>Template Sertifikat</h1>
                    <p>Kelola desain dari Canva dan atur posisi field dinamis untuk tiap template.</p>
                </div>
                <button
                    className="btn-primary-teal"
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                >
                    <i className="bi bi-upload"></i> Upload Template Baru
                </button>
            </div>

            <TemplateToolbar
                currentStatus={statusFilter}
                currentOrientation={orientationFilter}
                onStatusChange={handleStatusChange}
                onOrientationChange={handleOrientationChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                stats={effectiveStats}
            />

            {filteredData.length === 0 ? (
                <EmptyState
                    icon="bi-file-earmark-image"
                    title="Belum Ada Template Sertifikat"
                    description="Unggah desain template pertama Anda dari Canva (PNG, JPG, atau PDF) untuk mulai membuat dan menerbitkan sertifikat."
                    actionLabel="Upload Template Pertama"
                    actionIcon="bi-cloud-arrow-up"
                    onAction={() => setShowUploadModal(true)}
                />
            ) : (
                <div className={viewMode === 'grid' ? 'tpl-grid' : 'tpl-list-view'}>
                    {filteredData.map((tpl) => (
                        <TemplateCard
                            key={tpl.id}
                            template={tpl}
                            onEdit={(item) => setEditingTemplate(item)}
                            onDelete={(item) => setDeletingTemplate(item)}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}

                    <AddTemplateCard onClick={() => setShowUploadModal(true)} />
                </div>
            )}

            <UploadTemplateModal
                show={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSuccessNotification={(msg) => {
                    triggerToast(msg, 'success');
                    router.reload({ only: ['templates', 'stats'] });
                }}
            />

            <EditTemplateModal
                show={!!editingTemplate}
                template={editingTemplate}
                onClose={() => setEditingTemplate(null)}
                onSuccessNotification={(msg) => {
                    triggerToast(msg, 'success');
                    router.reload({ only: ['templates', 'stats'] });
                }}
            />

            <ConfirmDeleteModal
                show={!!deletingTemplate}
                itemName={deletingTemplate?.name}
                isLoading={isDeleting}
                onClose={() => !isDeleting && setDeletingTemplate(null)}
                onConfirm={handleConfirmDelete}
            />
        </AuthenticatedLayout>
    );
}
