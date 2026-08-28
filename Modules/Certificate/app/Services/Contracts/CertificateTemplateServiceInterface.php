<?php

namespace Modules\Certificate\Services\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Modules\Certificate\Models\CertificateTemplate;

interface CertificateTemplateServiceInterface
{
    public function getPaginatedTemplates(array $filters = [], int $perPage = 12): LengthAwarePaginator;

    public function getStatsSummary(): array;

    public function storeTemplate(array $data): CertificateTemplate;

    public function updateTemplate(string $id, array $data): CertificateTemplate;

    public function deleteTemplate(string $id): bool;
}
