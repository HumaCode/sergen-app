<?php

namespace Modules\UserAccess\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    use HasUlids;

    protected $fillable = [
        'name',
        'guard_name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
