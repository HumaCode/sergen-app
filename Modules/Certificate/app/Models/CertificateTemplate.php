<?php

namespace Modules\Certificate\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[Fillable(['name', 'placeholders', 'orientation', 'is_active'])]
class CertificateTemplate extends Model implements HasMedia
{
    use HasFactory, HasUlids, InteractsWithMedia;

    protected $table = 'certificate_templates';

    protected function casts(): array
    {
        return [
            'placeholders' => 'array',
            'is_active'    => 'boolean',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('template_files')
            ->useDisk('local') // Storage private: storage/app/private
            ->singleFile();
    }

    public function getFilePathAttribute(): ?string
    {
        $media = $this->getFirstMedia('template_files');
        return $media ? $media->getPath() : null;
    }

    public function getFileUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('template_files');
        return $media ? $media->getUrl() : null;
    }

    public function batches(): HasMany
    {
        return $this->hasMany(CertificateBatch::class, 'template_id');
    }
}
