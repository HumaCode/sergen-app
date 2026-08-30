<?php

namespace Modules\Certificate\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Certificate\Http\Requests\StoreCertificateRequest;
use Modules\Certificate\Http\Resources\CertificateResource;
use Modules\Certificate\Http\Resources\TemplateResource;
use Modules\Certificate\Services\Contracts\CertificateServiceInterface;
use Modules\Certificate\Services\Contracts\CertificateTemplateServiceInterface;

class CertificateController extends Controller
{
    public function __construct(
        protected CertificateServiceInterface $certificateService,
        protected CertificateTemplateServiceInterface $templateService
    ) {}

    /**
     * Display a listing of certificates.
     */
    public function index(): Response|JsonResponse
    {
        $certificates = $this->certificateService->getPaginatedCertificates(request()->all(), 12);

        if (request()->wantsJson()) {
            return ResponseHelper::success('Data sertifikat berhasil diambil', [
                'certificates' => CertificateResource::collection($certificates),
            ]);
        }

        return Inertia::render('Certificate::Sertifikat/Create', [
            'certificates' => CertificateResource::collection($certificates),
        ]);
    }

    /**
     * Show the form for creating a new certificate.
     */
    public function create(): Response
    {
        $templates = $this->templateService->getPaginatedTemplates([], 50);

        return Inertia::render('Certificate::Sertifikat/Create', [
            'templates' => TemplateResource::collection($templates->items())->resolve(),
        ]);
    }

    /**
     * Store a newly created certificate.
     */
    public function store(StoreCertificateRequest $request): JsonResponse|RedirectResponse
    {
        $data = $request->validated();
        $certificate = $this->certificateService->createCertificate([
            'certificate_number' => $data['certificate_number'],
            'status'             => 'published',
            'issued_at'          => now(),
        ]);

        if ($request->wantsJson()) {
            return ResponseHelper::success(
                'Sertifikat berhasil diterbitkan',
                new CertificateResource($certificate),
                201
            );
        }

        return redirect()->route('certificate.create')->with('success', 'Sertifikat berhasil diterbitkan');
    }

    /**
     * Display specified certificate.
     */
    public function show(string $id): JsonResponse|Response
    {
        $certificate = $this->certificateService->getCertificateById($id);

        if (!$certificate) {
            if (request()->wantsJson()) {
                return ResponseHelper::error('Sertifikat tidak ditemukan', 404);
            }
            abort(404, 'Sertifikat tidak ditemukan');
        }

        if (request()->wantsJson()) {
            return ResponseHelper::success('Detail sertifikat berhasil diambil', new CertificateResource($certificate));
        }

        return Inertia::render('Certificate::Sertifikat/Show', [
            'certificate' => new CertificateResource($certificate),
        ]);
    }

    /**
     * Remove specified certificate.
     */
    public function destroy(string $id): JsonResponse|RedirectResponse
    {
        $deleted = $this->certificateService->deleteCertificate($id);

        if (request()->wantsJson()) {
            return $deleted
                ? ResponseHelper::success('Sertifikat berhasil dihapus')
                : ResponseHelper::error('Gagal menghapus sertifikat', 400);
        }

        return redirect()->route('certificate.create')->with('success', 'Sertifikat berhasil dihapus');
    }
}
