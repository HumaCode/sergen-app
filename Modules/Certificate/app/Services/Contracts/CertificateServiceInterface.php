<?php

namespace Modules\Certificate\Services\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Modules\Certificate\Models\Certificate;

interface CertificateServiceInterface
{
    public function getCertificates(array $filters = []): Collection;

    public function getPaginatedCertificates(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function getCertificateById(string $id): ?Certificate;

    public function createCertificate(array $data): Certificate;

    public function updateCertificate(string $id, array $data): Certificate;

    public function deleteCertificate(string $id): bool;
}
