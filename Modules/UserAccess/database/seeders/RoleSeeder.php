<?php

namespace Modules\UserAccess\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\UserAccess\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Developer',
                'slug' => 'developer',
                'type_role' => 'system',
                'color' => '#dc3545', // Danger Red
                'priority' => 1,
                'is_active' => true,
                'description' => 'Akses penuh ke seluruh sistem dan konfigurasi internal.',
                'guard_name' => 'web',
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'type_role' => 'management',
                'color' => '#0d6efd', // Primary Blue
                'priority' => 2,
                'is_active' => true,
                'description' => 'Akses penuh manajemen aplikasi dengan batasan sistem internal.',
                'guard_name' => 'web',
            ],
            [
                'name' => 'Operator',
                'slug' => 'operator',
                'type_role' => 'operational',
                'color' => '#198754', // Success Green
                'priority' => 3,
                'is_active' => true,
                'description' => 'Skala operasional untuk input data peserta dan generate sertifikat.',
                'guard_name' => 'web',
            ],
            [
                'name' => 'Viewer',
                'slug' => 'viewer',
                'type_role' => 'read_only',
                'color' => '#6c757d', // Secondary Gray
                'priority' => 4,
                'is_active' => true,
                'description' => 'Skala viewer untuk melihat dan mendownload sertifikat terbit.',
                'guard_name' => 'web',
            ],
        ];

        foreach ($roles as $roleData) {
            // Menggunakan slug sebagai identifier unik (agar konsisten super_admin, admin, operator, viewer)
            Role::firstOrCreate(
                ['slug' => $roleData['slug'], 'guard_name' => $roleData['guard_name']],
                $roleData
            );
        }
    }
}
