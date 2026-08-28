<?php

namespace Modules\Certificate\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Modules\Certificate\Models\CertificateTemplate;
use Modules\Certificate\Repositories\Contracts\CertificateTemplateRepositoryInterface;
use Modules\Certificate\Services\Contracts\CertificateTemplateServiceInterface;

class CertificateTemplateService implements CertificateTemplateServiceInterface
{
    public function __construct(
        protected CertificateTemplateRepositoryInterface $repository
    ) {}

    public function getPaginatedTemplates(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return $this->repository->getPaginatedTemplates($filters, $perPage);
    }

    public function getStatsSummary(): array
    {
        return $this->repository->getStatsSummary();
    }

    public function storeTemplate(array $data): CertificateTemplate
    {
        $file = $data['file'] ?? null;
        unset($data['file'], $data['file_path']);

        $data['is_active'] = $data['is_active'] ?? true;
        $data['orientation'] = strtolower($data['orientation'] ?? 'landscape');

        $template = $this->repository->createTemplate($data);

        // Upload to private disk using Spatie Media Library
        if ($file instanceof UploadedFile) {
            $template->addMedia($file)
                ->toMediaCollection('template_files', 'local');
        }

        return $template;
    }

    public function updateTemplate(string $id, array $data): CertificateTemplate
    {
        $template = $this->repository->findById($id);
        if (!$template) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Template tidak ditemukan");
        }

        $file = $data['file'] ?? null;
        unset($data['file']);

        if (isset($data['orientation'])) {
            $data['orientation'] = strtolower($data['orientation']);
        }

        $this->repository->updateTemplate($id, $data);
        $template->refresh();

        if ($file instanceof UploadedFile) {
            $template->addMedia($file)
                ->toMediaCollection('template_files', 'local');
        }

        return $template;
    }

    public function deleteTemplate(string $id): bool
    {
        return $this->repository->deleteTemplate($id);
    }
}
