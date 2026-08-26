<?php

namespace Modules\Participant\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ParticipantSeeder extends Seeder
{
    public function run(): void
    {
        $participants = [
            ['nik' => '3201010100010001', 'name' => 'Ahmad Fauzan',         'email' => 'ahmad.fauzan@email.com',     'phone' => '081234567801', 'agency' => 'Dinas Kominfo Kota Bogor',          'position' => 'Analis Kebijakan'],
            ['nik' => '3201010100010002', 'name' => 'Nur Aisyah',           'email' => 'nur.aisyah@email.com',       'phone' => '081234567802', 'agency' => 'UMKM Batik Nusantara',              'position' => 'Pemilik Usaha'],
            ['nik' => '3201010100010003', 'name' => 'Budi Santoso',         'email' => 'budi.santoso@email.com',     'phone' => '081234567803', 'agency' => 'Kementerian PANRB',                 'position' => 'Pranata Komputer'],
            ['nik' => '3201010100010004', 'name' => 'Siti Rahmawati',       'email' => 'siti.rahmawati@email.com',   'phone' => '081234567804', 'agency' => 'BSSN',                              'position' => 'Analis Keamanan Siber'],
            ['nik' => '3201010100010005', 'name' => 'Rizki Hidayat',        'email' => 'rizki.hidayat@email.com',    'phone' => '081234567805', 'agency' => 'Dinas Kominfo Kota Bogor',          'position' => 'Pengembang Aplikasi'],
            ['nik' => '3201010100010006', 'name' => 'Dewi Permata',         'email' => 'dewi.permata@email.com',     'phone' => '081234567806', 'agency' => 'UMKM Batik Nusantara',              'position' => 'Manajer Pemasaran'],
            ['nik' => '3201010100010007', 'name' => 'Fajar Kurniawan',      'email' => 'fajar.kurniawan@email.com',  'phone' => '081234567807', 'agency' => 'PT Teknologi Maju',                 'position' => 'Software Engineer'],
            ['nik' => '3201010100010008', 'name' => 'Rina Marlina',         'email' => 'rina.marlina@email.com',     'phone' => '081234567808', 'agency' => 'Dinas Perdagangan Kab. Sukabumi',   'position' => 'Staf Administrasi'],
            ['nik' => '3201010100010009', 'name' => 'Dian Pratiwi',         'email' => 'dian.pratiwi@email.com',     'phone' => '081234567809', 'agency' => 'BPKAD Jawa Barat',                  'position' => 'Auditor'],
            ['nik' => '3201010100010010', 'name' => 'Hendra Gunawan',       'email' => 'hendra.gunawan@email.com',   'phone' => '081234567810', 'agency' => 'Kementerian Keuangan',              'position' => 'Analis Anggaran'],
            ['nik' => '3201010100010011', 'name' => 'Lestari Wulandari',    'email' => 'lestari.wulan@email.com',    'phone' => '081234567811', 'agency' => 'Inspektorat Kota Depok',            'position' => 'Auditor Intern'],
            ['nik' => '3201010100010012', 'name' => 'Agus Setiawan',        'email' => 'agus.setiawan@email.com',    'phone' => '081234567812', 'agency' => 'PT Nusa Teknindo',                  'position' => 'IT Manager'],
            ['nik' => '3201010100010013', 'name' => 'Maya Anggraini',       'email' => 'maya.anggraini@email.com',   'phone' => '081234567813', 'agency' => 'Dinas Kesehatan Kota Bandung',      'position' => 'Epidemiolog'],
            ['nik' => '3201010100010014', 'name' => 'Teguh Prasetyo',       'email' => 'teguh.prasetyo@email.com',   'phone' => '081234567814', 'agency' => 'BAPPEDA Kab. Cianjur',              'position' => 'Perencana'],
            ['nik' => '3201010100010015', 'name' => 'Fitri Handayani',      'email' => 'fitri.handayani@email.com',  'phone' => '081234567815', 'agency' => 'Kementerian Pendidikan',            'position' => 'Peneliti'],
            ['nik' => '3201010100010016', 'name' => 'Wahyu Nugroho',        'email' => 'wahyu.nugroho@email.com',    'phone' => '081234567816', 'agency' => 'Polres Kota Bekasi',                'position' => 'Perwira Teknologi'],
            ['nik' => '3201010100010017', 'name' => 'Suci Rahayu',          'email' => 'suci.rahayu@email.com',      'phone' => '081234567817', 'agency' => 'BPS Jawa Barat',                    'position' => 'Statistisi'],
            ['nik' => '3201010100010018', 'name' => 'Rendi Saputra',        'email' => 'rendi.saputra@email.com',    'phone' => '081234567818', 'agency' => 'Dinas Pekerjaan Umum Kota Bogor',   'position' => 'Teknisi Sipil'],
            ['nik' => '3201010100010019', 'name' => 'Putri Amalia',         'email' => 'putri.amalia@email.com',     'phone' => '081234567819', 'agency' => 'RSUD dr. Slamet Garut',             'position' => 'Apoteker'],
            ['nik' => '3201010100010020', 'name' => 'Doni Firmansyah',      'email' => 'doni.firmansyah@email.com',  'phone' => '081234567820', 'agency' => 'Dinas Kominfo Kota Bogor',          'position' => 'Teknisi Jaringan'],
            ['nik' => '3201010100010021', 'name' => 'Ayu Lestari',          'email' => 'ayu.lestari@email.com',      'phone' => '081234567821', 'agency' => 'Bank BJB',                          'position' => 'Analis Kredit'],
            ['nik' => '3201010100010022', 'name' => 'Eko Wijaya',           'email' => 'eko.wijaya@email.com',       'phone' => '081234567822', 'agency' => 'Dinas Pariwisata Kota Bogor',       'position' => 'Staf Promosi'],
            ['nik' => '3201010100010023', 'name' => 'Indah Permatasari',    'email' => 'indah.permata@email.com',    'phone' => '081234567823', 'agency' => 'UMKM Batik Nusantara',              'position' => 'Desainer Produk'],
            ['nik' => '3201010100010024', 'name' => 'Bayu Anggara',         'email' => 'bayu.anggara@email.com',     'phone' => '081234567824', 'agency' => 'Kementerian PANRB',                 'position' => 'Pengembang Kebijakan'],
            ['nik' => '3201010100010025', 'name' => 'Nadia Safitri',        'email' => 'nadia.safitri@email.com',    'phone' => '081234567825', 'agency' => 'BSSN',                              'position' => 'Peneliti Keamanan'],
            ['nik' => '3201010100010026', 'name' => 'Rudi Hartono',         'email' => 'rudi.hartono@email.com',     'phone' => '081234567826', 'agency' => 'Dinas Kominfo Kab. Bogor',          'position' => 'Operator Sistem'],
            ['nik' => '3201010100010027', 'name' => 'Sari Dewi',            'email' => 'sari.dewi@email.com',        'phone' => '081234567827', 'agency' => 'BAPPEDA Kota Bekasi',               'position' => 'Analis Data'],
            ['nik' => '3201010100010028', 'name' => 'Fauzi Rahman',         'email' => 'fauzi.rahman@email.com',     'phone' => '081234567828', 'agency' => 'PT Mitra Digital',                  'position' => 'DevOps Engineer'],
            ['nik' => '3201010100010029', 'name' => 'Tiara Kusuma',         'email' => 'tiara.kusuma@email.com',     'phone' => '081234567829', 'agency' => 'Kementerian Keuangan',              'position' => 'Bendahara'],
            ['nik' => '3201010100010030', 'name' => 'Gilang Ramadhan',      'email' => 'gilang.ramadhan@email.com',  'phone' => '081234567830', 'agency' => 'Universitas Pakuan',                'position' => 'Dosen'],
        ];

        foreach ($participants as $data) {
            DB::table('participants')->insertOrIgnore([
                'id'         => Str::ulid()->toString(),
                'nik'        => $data['nik'],
                'name'       => $data['name'],
                'email'      => $data['email'],
                'phone'      => $data['phone'],
                'agency'     => $data['agency'],
                'position'   => $data['position'],
                'is_active'  => true,
                'created_at' => now()->subDays(rand(1, 90)),
                'updated_at' => now(),
            ]);
        }
    }
}
