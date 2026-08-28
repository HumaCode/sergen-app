<?php

namespace Modules\Certificate\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Modules\Certificate\Models\CertificateTemplate;

interface CertificateTemplateRepositoryInterface
{
    public function getPaginatedTemplates(array $filters = [], int $perPage = 12): LengthAwarePaginator;

    public function getStatsSummary(): array;

    public function createTemplate(array $data): CertificateTemplate;

    public function findById(string $id): ?CertificateTemplate;

    public function updateTemplate(string $id, array $data): bool;

    public function deleteTemplate(string $id): bool;
}
