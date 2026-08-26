<?php

namespace Modules\Participant\Services\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ParticipantServiceInterface
{
    public function getPaginatedParticipants(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    public function getStatsSummary(): array;
}
