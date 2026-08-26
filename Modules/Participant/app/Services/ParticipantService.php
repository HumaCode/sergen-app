<?php

namespace Modules\Participant\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Modules\Participant\Repositories\Contracts\ParticipantRepositoryInterface;
use Modules\Participant\Services\Contracts\ParticipantServiceInterface;

class ParticipantService implements ParticipantServiceInterface
{
    public function __construct(
        protected ParticipantRepositoryInterface $repository
    ) {}

    public function getPaginatedParticipants(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return $this->repository->getPaginated($filters, $perPage);
    }

    public function getStatsSummary(): array
    {
        return $this->repository->getStatsSummary();
    }
}
