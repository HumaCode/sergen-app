<?php

namespace Modules\Certificate\Repositories\Eloquent;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Modules\Certificate\Models\Certificate;
use Modules\Certificate\Repositories\Contracts\CertificateRepositoryInterface;

class CertificateRepository implements CertificateRepositoryInterface
{
    public function getAll(array $filters = []): Collection
    {
        $query = Certificate::query()->with(['batch', 'participant']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('certificate_number', 'like', "%{$search}%")
                    ->orWhere('verification_code', 'like', "%{$search}%");
            });
        }

        return $query->latest()->get();
    }

    public function getPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Certificate::query()->with(['batch', 'participant']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('certificate_number', 'like', "%{$search}%")
                    ->orWhere('verification_code', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function findById(string $id): ?Certificate
    {
        return Certificate::with(['batch', 'participant'])->find($id);
    }

    public function create(array $data): Certificate
    {
        if (empty($data['verification_code'])) {
            $data['verification_code'] = $this->generateVerificationCode();
        }

        return Certificate::create($data);
    }

    public function update(string $id, array $data): Certificate
    {
        $certificate = $this->findById($id);
        if (!$certificate) {
            throw new \RuntimeException('Sertifikat tidak ditemukan');
        }

        $certificate->update($data);
        return $certificate->fresh(['batch', 'participant']);
    }

    public function delete(string $id): bool
    {
        $certificate = $this->findById($id);
        return $certificate ? (bool) $certificate->delete() : false;
    }

    public function generateVerificationCode(): string
    {
        do {
            $code = 'CERT-' . strtoupper(Str::random(8));
        } while (Certificate::where('verification_code', $code)->exists());

        return $code;
    }
}
