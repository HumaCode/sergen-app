<?php

namespace Modules\Certificate\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'certificate_number' => $this->certificate_number,
            'verification_code' => $this->verification_code,
            'status'             => $this->status,
            'issued_at'          => $this->issued_at?->format('d M Y') ?? '—',
            'participant'        => $this->whenLoaded('participant', fn () => [
                'id'   => $this->participant?->id,
                'name' => $this->participant?->name,
            ]),
            'batch'              => $this->whenLoaded('batch', fn () => [
                'id'   => $this->batch?->id,
                'name' => $this->batch?->name,
            ]),
        ];
    }
}
