<?php

namespace Modules\Certificate\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'file_path', 'placeholders', 'orientation', 'is_active'])]
class CertificateTemplate extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'certificate_templates';

    protected function casts(): array
    {
        return [
            'placeholders' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function batches(): HasMany
    {
        return $this->hasMany(CertificateBatch::class, 'template_id');
    }
}
