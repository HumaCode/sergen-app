<?php

use Illuminate\Support\Facades\Cache;
use Modules\UserAccess\Models\Menu;

if (!function_exists('tgl_indo')) {
    function tgl_indo($tgl, $tampil_hari = false, $tampil_jam = false)
    {
        if (!$tgl) return null;

        // 🔹 Kalau input adalah Carbon instance, ubah ke string Y-m-d H:i:s
        if ($tgl instanceof \Carbon\Carbon) {
            $tgl = $tgl->format('Y-m-d H:i:s');
        }

        $nama_hari  = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
        $nama_bulan = [
            1 => 'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        ];

        $tahun   = substr($tgl, 0, 4);
        $bulan   = $nama_bulan[(int) substr($tgl, 5, 2)];
        $tanggal = substr($tgl, 8, 2);
        $text    = '';

        if ($tampil_hari) {
            $urutan_hari = date('w', strtotime($tgl));
            $hari        = $nama_hari[$urutan_hari];
            $text        = "$hari, $tanggal $bulan $tahun";
        } else {
            $text = "$tanggal $bulan $tahun";
        }

        if ($tampil_jam) {
            $jam = substr($tgl, 11, 5);
            $text .= " - $jam";
        }

        return $text;
    }
}

if (!function_exists('menus')) {
    function menus($grouped = true)
    {
        $user = auth()->user();
        if (!$user) {
            return collect();
        }

        // Check if user is SuperAdmin or Dev role (bypass permission check if role has super privileges)
        $isDev = false;
        if (method_exists($user, 'hasRole')) {
            $isDev = $user->hasRole('dev') || $user->hasRole('admin') || $user->hasRole('super-admin');
        }

        // Get user permissions
        $userPermissionNames = [];
        if (method_exists($user, 'getAllPermissions')) {
            $userPermissionNames = $user->getAllPermissions()->pluck('name')->toArray();
        }

        // Get active menus with their permissions
        $menus = Menu::with('permissions')
            ->where('is_active', true)
            ->orderBy('orders')
            ->get();

        // Filter menus based on user permission / role
        $filteredMenus = $menus->filter(function ($menu) use ($isDev, $userPermissionNames) {
            // SuperAdmin/dev gets all active menus
            if ($isDev) {
                return true;
            }

            // If menu has no associated permissions, allow display by default
            if ($menu->permissions->isEmpty()) {
                return true;
            }

            // Check if user has any permission associated with this menu (e.g. "read dashboard", "menu dashboard", etc.)
            foreach ($menu->permissions as $perm) {
                if (in_array($perm->name, $userPermissionNames)) {
                    return true;
                }
            }

            return false;
        });

        // If requested grouped (for Sidebar)
        if ($grouped) {
            return $filteredMenus->groupBy('category');
        }

        return $filteredMenus;
    }
}

if (!function_exists('urlMenu')) {
    function urlMenu()
    {
        return menus(false)->whereNotNull('url')->pluck('url')->toArray();
    }
}