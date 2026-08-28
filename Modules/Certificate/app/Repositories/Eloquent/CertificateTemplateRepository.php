<?php

namespace Modules\Certificate\Repositories\Eloquent;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Modules\Certificate\Models\CertificateTemplate;
use Modules\Certificate\Repositories\Contracts\CertificateTemplateRepositoryInterface;

class CertificateTemplateRepository implements CertificateTemplateRepositoryInterface
{
    public function getPaginatedTemplates(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = CertificateTemplate::query()->withCount('batches');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            if ($filters['status'] === 'active') {
                $query->where('is_active', true);
            } elseif ($filters['status'] === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if (!empty($filters['orientation']) && $filters['orientation'] !== 'all') {
            $query->where('orientation', strtolower($filters['orientation']));
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function getStatsSummary(): array
    {
        return [
            'total'     => CertificateTemplate::count(),
            'active'    => CertificateTemplate::where('is_active', true)->count(),
            'inactive'  => CertificateTemplate::where('is_active', false)->count(),
            'landscape' => CertificateTemplate::where('orientation', 'landscape')->count(),
            'portrait'  => CertificateTemplate::where('orientation', 'portrait')->count(),
        ];
    }

    public function createTemplate(array $data): CertificateTemplate
    {
        return CertificateTemplate::create($data);
    }

    public function findById(string $id): ?CertificateTemplate
    {
        return CertificateTemplate::find($id);
    }

    public function updateTemplate(string $id, array $data): bool
    {
        $template = $this->findById($id);
        return $template ? $template->update($data) : false;
    }

    public function deleteTemplate(string $id): bool
    {
        $template = $this->findById($id);
        return $template ? (bool) $template->delete() : false;
    }
}
