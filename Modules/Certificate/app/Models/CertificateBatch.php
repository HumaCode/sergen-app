<?php

namespace Modules\Certificate\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'batch_number',
    'title',
    'template_id',
    'event_date',
    'total_recipients',
    'processed_recipients',
    'status',
    'created_by',
])]
class CertificateBatch extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'certificate_batches';

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'total_recipients' => 'integer',
            'processed_recipients' => 'integer',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(CertificateTemplate::class, 'template_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class, 'batch_id');
    }
}
