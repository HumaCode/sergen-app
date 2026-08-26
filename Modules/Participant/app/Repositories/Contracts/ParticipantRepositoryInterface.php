<?php

namespace Modules\Participant\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ParticipantRepositoryInterface
{
    /**
     * Get paginated list of participants with search & filter
     */
    public function getPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator;

    /**
     * Get statistics summary
     */
    public function getStatsSummary(): array;
}
