<?php

namespace Modules\UserAccess\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasUlids;

    protected $fillable = [
        'name',
        'slug',
        'type_role',
        'color',
        'priority',
        'is_active',
        'description',
        'guard_name',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];
}
