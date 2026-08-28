<?php

namespace Modules\Certificate\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $media = $this->getFirstMedia('template_files');

        return [
            'id'                 => $this->id,
            'name'               => $this->name,
            'file_url'           => $media ? route('certificate.templates.media', $this->id) : null,
            'file_name'          => $media?->file_name ?? null,
            'file_size'          => $media?->size ?? null,
            'mime_type'          => $media?->mime_type ?? null,
            'orientation'        => ucfirst($this->orientation ?? 'landscape'),
            'is_active'          => (bool) $this->is_active,
            'dimension'          => strtolower($this->orientation) === 'portrait' ? '1414×2000 px' : '2000×1414 px',
            'used_batches_count' => $this->batches_count ?? ($this->relationLoaded('batches') ? $this->batches->count() : 0),
            'palette_class'      => 'pal-' . ((crc32($this->id) % 4) + 1),
            'created_at'         => $this->created_at?->format('d M Y') ?? '—',
        ];
    }
}
