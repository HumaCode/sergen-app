# Spesifikasi Aplikasi — Generator Sertifikat
**Nama kerja: SerGen** *(placeholder, bisa diganti sesuai keputusan branding akhir)*

---

## 1. Ringkasan

Aplikasi web untuk membuat sertifikat digital dengan cara menempatkan data dinamis (nama, nomor sertifikat, tanggal, tanda tangan, dll) di atas desain template yang diimpor dari Canva (PNG/JPG/PDF). Admin dapat mengatur posisi setiap field secara visual (drag-and-drop) di atas template, lalu sistem menggenerate sertifikat massal berdasarkan data peserta.

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Laravel 13 |
| Frontend | React + Inertia.js |
| UI Framework | Bootstrap 5.3.3 + Bootstrap Icons |
| Font | Poppins / Plus Jakarta Sans |
| Database | MySQL / PostgreSQL |
| Primary Key | **ULID** (`ulid` untuk semua tabel) |
| Role & Permission | **spatie/laravel-permission** |
| Media | spatie/laravel-medialibrary (opsional, untuk file template & TTD) |
| Activity Log | spatie/laravel-activitylog (opsional, audit trail) |
| Generate gambar/overlay | Intervention Image v3 |
| Generate PDF presisi tinggi | Spatie Browsershot (opsional) / barryvdh/laravel-dompdf |
| Editor visual (drag posisi) | React + Konva.js (react-konva) |
| Tanda tangan digital | signature_pad (JS) atau upload PNG transparan |
| Import data massal | maatwebsite/excel |
| Bundling download | ZipArchive (native PHP) |
| Queue | Laravel Queue (database/redis driver) |

---

## 3. Role & Hak Akses (spatie/laravel-permission)

### Role
| Role | Deskripsi |
|---|---|
| `super-admin` | Akses penuh ke seluruh sistem |
| `admin` | Kelola template, peserta, dan generate sertifikat |
| `operator` | Hanya bisa input data peserta & generate sertifikat dari template yang sudah ada |
| `viewer` | Hanya bisa melihat & mengunduh sertifikat yang sudah terbit |

### Permission (contoh)
```
template.view
template.create
template.update
template.delete
participant.view
participant.create
participant.import
certificate.generate
certificate.download
certificate.revoke
user.manage
role.manage
```

Assignment role/permission dikelola lewat panel admin, menggunakan trait `HasRoles` pada model `User`.

---

## 4. Struktur Database (ULID)

Semua tabel menggunakan `ulid` sebagai primary key (`$table->ulid('id')->primary()`), memakai trait `HasUlids` bawaan Laravel di setiap model.

### `users`
| Kolom | Tipe |
|---|---|
| id | ulid, PK |
| name | string |
| email | string, unique |
| password | string |
| ... | (standar Laravel + kolom spatie permission via tabel pivot) |

### `certificate_templates`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | ulid, PK | |
| name | string | Nama template |
| description | text, nullable | |
| image_path | string | Path file desain (dari Canva) |
| width | integer | Lebar asli gambar (px) |
| height | integer | Tinggi asli gambar (px) |
| orientation | enum('landscape','portrait') | |
| created_by | ulid, FK → users.id | |
| is_active | boolean, default true | |
| timestamps | | |

### `certificate_fields`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | ulid, PK | |
| template_id | ulid, FK → certificate_templates.id | |
| field_key | string | mis. `nama`, `no_sertifikat`, `tanggal`, `ttd` |
| label | string | Label tampilan di editor |
| type | enum('text','date','image') | `image` khusus untuk TTD/logo |
| x, y | integer | Posisi (px, relatif ke gambar asli) |
| width, height | integer | |
| font_size | integer, nullable | |
| font_family | string, nullable | |
| font_color | string, nullable | Hex color |
| text_align | enum('left','center','right'), nullable | |
| order | integer | Urutan input di form |
| timestamps | | |

### `certificate_batches`
*(satu batch = satu event/acara generate massal)*
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | ulid, PK | |
| template_id | ulid, FK | |
| name | string | Nama acara/batch |
| created_by | ulid, FK → users.id | |
| status | enum('draft','processing','completed','failed') | |
| timestamps | | |

### `certificate_participants`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | ulid, PK | |
| batch_id | ulid, FK → certificate_batches.id | |
| data | json | Isi field dinamis, mis. `{"nama": "...", "no_sertifikat": "...", "tanggal": "..."}` |
| certificate_number | string, unique, nullable | Nomor unik untuk verifikasi |
| file_path | string, nullable | Path hasil generate (PDF/PNG) |
| status | enum('pending','generated','failed') | |
| generated_at | timestamp, nullable | |
| timestamps | | |

### `certificate_verifications` *(opsional — untuk QR/verifikasi publik)*
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | ulid, PK | |
| participant_id | ulid, FK → certificate_participants.id | |
| verification_code | string, unique | Kode/slug untuk URL publik verifikasi |
| is_valid | boolean, default true | Bisa dipakai untuk revoke sertifikat |
| timestamps | | |

### `activity_log` *(dari spatie/laravel-activitylog, opsional)*
Log otomatis untuk create/update/delete template, batch, dan generate sertifikat.

---

## 5. Arsitektur (Clean Architecture — sesuai pola kerja)

```
app/
├── Models/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Services/
│   ├── TemplateService.php
│   ├── CertificateGeneratorService.php
│   └── BulkImportService.php
├── Repositories/
│   ├── Interfaces/
│   └── Eloquent/
├── Jobs/
│   └── GenerateCertificateJob.php   // untuk queue bulk generate
└── Providers/
    └── RepositoryServiceProvider.php // binding interface → repository (DI)
```

---

## 6. Alur Fitur Utama

### 6.1 Kelola Template
1. Admin upload gambar desain (dari Canva, PNG/JPG/PDF).
2. Sistem simpan ke `certificate_templates`, catat width/height asli.
3. Admin buka **editor visual** (Konva.js) → drag kotak untuk tiap field (`nama`, `no_sertifikat`, `tanggal`, `ttd`, dll) di atas preview gambar.
4. Posisi disimpan ke `certificate_fields` (x, y, width, height, font, warna, align).

### 6.2 Input Data Peserta
- Manual (form dinamis berdasarkan `certificate_fields` dari template terpilih), atau
- Import massal via Excel (Laravel Excel) → mapping kolom Excel ke `field_key`.

### 6.3 Generate Sertifikat
1. Sistem baca template + field mapping + data peserta per batch.
2. `GenerateCertificateJob` dijalankan lewat queue (untuk volume besar, hindari timeout).
3. Intervention Image overlay teks/TTD di atas gambar template sesuai koordinat.
4. Simpan hasil (PNG/PDF) ke storage, update `file_path` & `status` di `certificate_participants`.
5. Setelah semua selesai, batch bisa di-download sebagai ZIP (ZipArchive).

### 6.4 Verifikasi Publik (opsional)
- Tiap sertifikat punya `certificate_number` + QR code mengarah ke halaman publik `/verify/{verification_code}`.
- Halaman menampilkan status valid/tidak, nama, dan detail sertifikat.

---

## 7. Non-Fungsional

- **Queue wajib** untuk generate > 20 sertifikat sekaligus (hindari timeout HTTP).
- **Storage**: local disk untuk development, S3-compatible untuk production.
- **Font custom**: file `.ttf/.otf` disimpan di `storage/fonts`, path didaftarkan eksplisit ke Intervention Image.
- **Tidak ada dark mode** (sesuai preferensi UI standar).
- Desain UI: sidebar + topbar, card glassmorphism, Bootstrap 5.3.3, Poppins/Plus Jakarta Sans.

---

## 8. Rencana Modul Pengembangan (bertahap)

| Fase | Modul |
|---|---|
| 1 | Auth + Role/Permission (spatie) + struktur ULID dasar |
| 2 | CRUD Template + Upload gambar |
| 3 | Editor visual (Konva.js) untuk posisi field |
| 4 | Input peserta manual + form dinamis |
| 5 | Generate single certificate (Intervention Image) |
| 6 | Import Excel + generate batch via Queue |
| 7 | Download ZIP + halaman verifikasi publik (QR) |
