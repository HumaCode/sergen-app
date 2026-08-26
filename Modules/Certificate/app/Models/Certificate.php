<?php

namespace Modules\Certificate\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Participant\Models\Participant;

#[Fillable([
    'certificate_number',
    'batch_id',
    'participant_id',
    'role_title',
    'file_path',
    'qr_code_path',
    'verification_code',
    'status',
    'issued_at',
])]
class Certificate extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'certificates';

    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
        ];
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(CertificateBatch::class, 'batch_id');
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'participant_id');
    }
}
