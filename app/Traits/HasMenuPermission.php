namespace App\Traits;

use Modules\UserAccess\Models\Menu;
use Modules\UserAccess\Models\Permission;

trait HasMenuPermission
{
    public function attachMenupermission(Menu $menu, array | null $permissions, array | null $roles)
    {
        if (!is_array($permissions)) {
            $permissions = ['menu', 'create', 'read', 'show', 'update', 'delete'];
        }

        foreach ($permissions as $item) {
            $permission = Permission::firstOrCreate([
                'name' => $item . " $menu->url"
            ], [
                'guard_name' => 'web'
            ]);

            $permission->menus()->syncWithoutDetaching([$menu->id]);

            if ($roles) {
                $permission->assignRole($roles);
            }
        }
    }
}