<?php

namespace Modules\UserAccess\Database\Seeders;

use App\Traits\HasMenuPermission;
use Illuminate\Database\Seeder;
use Modules\UserAccess\Models\Menu;

class MenuSeeder extends Seeder
{
    use HasMenuPermission;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            // Kategori: UTAMA
            [
                'name' => 'Dashboard',
                'url' => 'dashboard',
                'category' => 'UTAMA',
                'icon' => 'bi bi-grid-fill',
                'is_active' => true,
                'orders' => 1,
            ],

            // Kategori: SERTIFIKAT
            [
                'name' => 'Template',
                'url' => 'templates',
                'category' => 'SERTIFIKAT',
                'icon' => 'bi bi-file-earmark-image',
                'is_active' => true,
                'orders' => 2,
            ],
            [
                'name' => 'Buat Sertifikat',
                'url' => 'certificates/create',
                'category' => 'SERTIFIKAT',
                'icon' => 'bi bi-magic',
                'is_active' => true,
                'orders' => 3,
            ],
            [
                'name' => 'Batch Generate',
                'url' => 'certificates/batches',
                'category' => 'SERTIFIKAT',
                'icon' => 'bi bi-layers',
                'is_active' => true,
                'orders' => 4,
            ],
            [
                'name' => 'Verifikasi',
                'url' => 'verifications',
                'category' => 'SERTIFIKAT',
                'icon' => 'bi bi-qr-code-scan',
                'is_active' => true,
                'orders' => 5,
            ],

            // Kategori: DATA
            [
                'name' => 'Peserta',
                'url' => 'participants',
                'category' => 'DATA',
                'icon' => 'bi bi-people',
                'is_active' => true,
                'orders' => 6,
            ],
            [
                'name' => 'Import Excel',
                'url' => 'participants/import',
                'category' => 'DATA',
                'icon' => 'bi bi-file-earmark-spreadsheet',
                'is_active' => true,
                'orders' => 7,
            ],

            // Kategori: PENGATURAN
            [
                'name' => 'Pengguna & Role',
                'url' => 'users',
                'category' => 'PENGATURAN',
                'icon' => 'bi bi-person-badge',
                'is_active' => true,
                'orders' => 8,
            ],
            [
                'name' => 'Preferensi Akun',
                'url' => 'settings/account',
                'category' => 'PENGATURAN',
                'icon' => 'bi bi-gear',
                'is_active' => true,
                'orders' => 9,
            ],
            [
                'name' => 'Profile',
                'url' => 'profile',
                'category' => 'PENGATURAN',
                'icon' => 'bi bi-person-circle',
                'is_active' => true,
                'orders' => 10,
            ],

            // Kategori: KONFIGURASI
            [
                'name' => 'Menu Manajemen',
                'url' => 'menus',
                'category' => 'KONFIGURASI',
                'icon' => 'bi bi-list-nested',
                'is_active' => true,
                'orders' => 11,
            ],
            [
                'name' => 'Role',
                'url' => 'roles',
                'category' => 'KONFIGURASI',
                'icon' => 'bi bi-shield-lock',
                'is_active' => true,
                'orders' => 12,
            ],
            [
                'name' => 'Permission',
                'url' => 'permissions',
                'category' => 'KONFIGURASI',
                'icon' => 'bi bi-key',
                'is_active' => true,
                'orders' => 13,
            ],
        ];

        foreach ($menus as $data) {
            // Ambil dan pisahkan 'permissions' dari array utama agar tidak ikut ter-insert
            // ke table 'menus' jika kolom permissions tidak ada di database.
            $customPermissions = $data['permissions'] ?? null;

            // Hapus 'permissions' dari array agar firstOrCreate/updateOrCreate tidak error (opsional jika kolom tidak ada)
            unset($data['permissions']);

            $menu = Menu::updateOrCreate(
                ['url' => $data['url']],
                $data
            );

            // Jika $customPermissions null, fungsi Anda akan otomatis membuat defaultnya
            // Jika ada nilainya, ia akan menggunakan array khusus tersebut.
            $this->attachMenupermission($menu, $customPermissions, ['dev']);
        }
    }
}
