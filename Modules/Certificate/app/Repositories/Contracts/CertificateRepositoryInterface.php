<?php

namespace Modules\Certificate\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Modules\Certificate\Models\Certificate;

interface CertificateRepositoryInterface
{
    public function getAll(array $filters = []): Collection;

    public function getPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function findById(string $id): ?Certificate;

    public function create(array $data): Certificate;

    public function update(string $id, array $data): Certificate;

    public function delete(string $id): bool;

    public function generateVerificationCode(): string;
}
