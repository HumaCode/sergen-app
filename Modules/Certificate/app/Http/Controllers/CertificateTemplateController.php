<?php

namespace Modules\Certificate\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaginateResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Certificate\Http\Requests\StoreTemplateRequest;
use Modules\Certificate\Http\Requests\TemplateFilterRequest;
use Modules\Certificate\Http\Requests\UpdateTemplateRequest;
use Modules\Certificate\Http\Resources\TemplateResource;
use Modules\Certificate\Services\Contracts\CertificateTemplateServiceInterface;

class CertificateTemplateController extends Controller
{
    public function __construct(
        protected CertificateTemplateServiceInterface $templateService
    ) {}

    /**
     * Display a listing of certificate templates.
     */
    public function index(TemplateFilterRequest $request): Response|JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 12);

        $paginatedData = $this->templateService->getPaginatedTemplates($filters, $perPage);
        $stats = $this->templateService->getStatsSummary();

        // If requested via JSON API
        if ($request->wantsJson()) {
            $paginatedResource = new PaginateResource($paginatedData, TemplateResource::class);
            return ResponseHelper::success('Data template berhasil diambil', [
                'templates' => $paginatedResource,
                'stats'     => $stats,
            ]);
        }

        // Return Inertia page response
        return Inertia::render('Certificate::Template/Index', [
            'templates' => new PaginateResource($paginatedData, TemplateResource::class),
            'stats'     => $stats,
            'filters'   => $filters,
        ]);
    }

    /**
     * Store a newly created template.
     */
    public function store(StoreTemplateRequest $request): JsonResponse|RedirectResponse
    {
        $data = $request->validated();
        $template = $this->templateService->storeTemplate($data);

        if ($request->wantsJson()) {
            return ResponseHelper::success(
                'Template berhasil dibuat',
                new TemplateResource($template),
                201
            );
        }

        return redirect()->route('certificate.templates.index')->with('success', 'Template berhasil dibuat');
    }

    /**
     * Update specified template.
     */
    public function update(UpdateTemplateRequest $request, string $id): JsonResponse|RedirectResponse
    {
        $data = $request->validated();
        $template = $this->templateService->updateTemplate($id, $data);

        if ($request->wantsJson()) {
            return ResponseHelper::success(
                'Template berhasil diperbarui',
                new TemplateResource($template)
            );
        }

        return redirect()->route('certificate.templates.index')->with('success', 'Template berhasil diperbarui');
    }

    /**
     * Remove specified template.
     */
    public function destroy(string $id): JsonResponse|RedirectResponse
    {
        $this->templateService->deleteTemplate($id);

        if (request()->wantsJson()) {
            return ResponseHelper::success('Template berhasil dihapus');
        }

        return redirect()->route('certificate.templates.index')->with('success', 'Template berhasil dihapus');
    }

    /**
     * Serve private media template file.
     */
    public function media(string $id)
    {
        $template = \Modules\Certificate\Models\CertificateTemplate::findOrFail($id);
        $media = $template->getFirstMedia('template_files');

        if (!$media || !file_exists($media->getPath())) {
            abort(404, 'File template tidak ditemukan');
        }

        return response()->file($media->getPath(), [
            'Content-Type'  => $media->mime_type ?? 'image/png',
            'Cache-Control' => 'no-cache, private',
        ]);
    }

    /**
     * Update placeholder coordinates for template.
     */
    public function updatePlaceholders(string $id, \Illuminate\Http\Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'placeholders' => 'required|array',
        ]);

        $template = \Modules\Certificate\Models\CertificateTemplate::findOrFail($id);
        $template->update([
            'placeholders' => $request->input('placeholders'),
        ]);

        if (request()->wantsJson()) {
            return ResponseHelper::success('Koordinat canvas template berhasil diperbarui', new TemplateResource($template));
        }

        return redirect()->back()->with('success', 'Koordinat canvas template berhasil diperbarui');
    }
}
