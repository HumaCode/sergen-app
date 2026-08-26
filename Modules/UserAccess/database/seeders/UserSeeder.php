<?php

namespace Modules\UserAccess\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users   = ['dev', 'admin', 'operator', 'viewer'];
        $default = [
            'email_verified_at' => now(),
            'password'          => Hash::make('123'),
            'remember_token'    => Str::random(10),
        ];

        foreach ($users as $value) {
            $user = User::firstOrCreate(
                ['username' => $value],
                [...$default, ...[
                    'name'      => ucwords($value),
                    'email'     => $value . '@gmail.com',
                    'is_active' => '1',
                ]]
            );

            // Find role by slug and assign
            $role = \Modules\UserAccess\Models\Role::where('slug', $value)->first();
            if ($role && ! $user->hasRole($role)) {
                $user->assignRole($role);
            }
        }
    }
}
