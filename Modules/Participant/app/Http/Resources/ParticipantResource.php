<?php

namespace Modules\Participant\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParticipantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Compute avatar initials from name
        $nameParts = explode(' ', trim($this->name ?? ''));
        $initials = count($nameParts) >= 2
            ? strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[1], 0, 1))
            : strtoupper(substr($this->name ?? 'US', 0, 2));

        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'phone'          => $this->phone,
            'nik'            => $this->nik,
            'agency'         => $this->agency,
            'position'       => $this->position,
            'is_active'      => (bool) $this->is_active,
            'avatarInitials' => $initials,
            'created_at'     => $this->created_at?->format('d M Y'),
        ];
    }
}
