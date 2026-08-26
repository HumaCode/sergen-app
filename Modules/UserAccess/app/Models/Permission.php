<?php

namespace Modules\UserAccess\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Spatie\Permission\Models\Permission as SpatiePermission;

#[Fillable(['name', 'guard_name', 'is_active'])]
class Permission extends SpatiePermission
{
    use HasUlids;

    /**
     * Get the menus associated with the permission.
     */
    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'menu_has_permissions', 'permission_id', 'menu_id');
    }
}
