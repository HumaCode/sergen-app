<?php

namespace Modules\Certificate\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Modules\Certificate\Models\Certificate;
use Modules\Certificate\Repositories\Contracts\CertificateRepositoryInterface;
use Modules\Certificate\Services\Contracts\CertificateServiceInterface;

class CertificateService implements CertificateServiceInterface
{
    public function __construct(
        protected CertificateRepositoryInterface $certificateRepository
    ) {}

    public function getCertificates(array $filters = []): Collection
    {
        return $this->certificateRepository->getAll($filters);
    }

    public function getPaginatedCertificates(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return $this->certificateRepository->getPaginated($filters, $perPage);
    }

    public function getCertificateById(string $id): ?Certificate
    {
        return $this->certificateRepository->findById($id);
    }

    public function createCertificate(array $data): Certificate
    {
        if (empty($data['issued_at'])) {
            $data['issued_at'] = now();
        }

        if (empty($data['status'])) {
            $data['status'] = 'published';
        }

        return $this->certificateRepository->create($data);
    }

    public function updateCertificate(string $id, array $data): Certificate
    {
        return $this->certificateRepository->update($id, $data);
    }

    public function deleteCertificate(string $id): bool
    {
        return $this->certificateRepository->delete($id);
    }
}
