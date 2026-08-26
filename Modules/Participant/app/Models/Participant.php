<?php

namespace Modules\Participant\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nik', 'name', 'email', 'phone', 'agency', 'position', 'is_active'])]
class Participant extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'participants';

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
