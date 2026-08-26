<?php

namespace Modules\UserAccess\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'url', 'category', 'icon', 'is_active', 'orders'])]
class Menu extends Model
{
    use HasUlids;

    protected $table = 'menus';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'orders' => 'integer',
        ];
    }
}
