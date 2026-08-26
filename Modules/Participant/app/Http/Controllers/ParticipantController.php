<?php

namespace Modules\Participant\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaginateResource;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Modules\Participant\Http\Requests\ParticipantFilterRequest;
use Modules\Participant\Http\Resources\ParticipantResource;
use Modules\Participant\Services\Contracts\ParticipantServiceInterface;

class ParticipantController extends Controller
{
    public function __construct(
        protected ParticipantServiceInterface $participantService
    ) {}

    /**
     * Display a listing of the participants page via Inertia.
     */
    public function index(ParticipantFilterRequest $request): Response|JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 10);

        $paginatedData = $this->participantService->getPaginatedParticipants($filters, $perPage);
        $stats = $this->participantService->getStatsSummary();

        // If requested via JSON API
        if ($request->wantsJson()) {
            $paginatedResource = new PaginateResource($paginatedData, ParticipantResource::class);
            return ResponseHelper::success('Data peserta berhasil diambil', [
                'participants' => $paginatedResource,
                'stats'        => $stats,
            ]);
        }

        // Return Inertia page response
        return Inertia::render('Participant::Index', [
            'participants' => new PaginateResource($paginatedData, ParticipantResource::class),
            'stats'        => $stats,
            'filters'      => $filters,
        ]);
    }
}
