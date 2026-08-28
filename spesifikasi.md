# Spesifikasi & Struktur Project: Sergen App (Certificate Generator)

Aplikasi **Sergen App** adalah sistem pembuatan dan pengelolaan sertifikat digital berbasis **Laravel 13**, **Inertia.js v2/v3**, **React 19**, **TypeScript**, dan **Tailwind CSS v4** dengan arsitektur **Modular Monolith** (`nwidart/laravel-modules`).

---

## 📁 Struktur Folder Project

Berikut adalah struktur folder terperinci dari aplikasi **Sergen App**:

```text
sergen-app/
├── .agents/                        # Konfigurasi agen AI & aturan proyek
├── app/                            # Core Framework Logic & Shared Code
│   ├── Helpers/                    # Helper global (Helper.php, ResponseHelper.php)
│   ├── Http/                       # Base Controller & Middleware
│   │   ├── Controllers/            # Base Controller, ProfileController
│   │   ├── Middleware/             # Middleware aplikasi
│   │   └── Resources/              # Shared Resources (PaginateResource.php, dll.)
│   ├── Models/                     # Shared/Core Models (User.php)
│   ├── Providers/                  # Service Providers
│   └── Traits/                     # Shared Traits
├── bootstrap/                      # Bootstrap aplikasi & provider registry
│   └── app.php
├── config/                         # Konfigurasi Laravel (auth, database, media-library, permission, modules)
├── database/                       # Migrasi dasar & seeders
│   ├── factories/
│   ├── migrations/                 # Migrasi bawaan (users, cache, jobs, media)
│   └── seeders/
├── Modules/                        # Modul Utama (Modular Monolith)
│   ├── Certificate/                # Modul Pengelolaan & Penerbitan Sertifikat
│   │   ├── app/
│   │   │   ├── Http/
│   │   │   │   ├── Controllers/    # CertificateController, CertificateTemplateController
│   │   │   │   ├── Requests/       # StoreTemplateRequest, UpdateTemplateRequest, dll.
│   │   │   │   └── Resources/      # TemplateResource, CertificateResource
│   │   │   ├── Models/             # CertificateTemplate, CertificateBatch, Certificate
│   │   │   ├── Providers/          # CertificateServiceProvider
│   │   │   ├── Repositories/       # Contract & Eloquent Repositories
│   │   │   └── Services/           # Contract & Service Implementation
│   │   ├── config/                 # Konfigurasi spesifik modul
│   │   ├── database/
│   │   │   ├── factories/
│   │   │   ├── migrations/         # Migrasi tabel certificate_templates, batches, certificates
│   │   │   └── seeders/
│   │   ├── resources/
│   │   │   └── assets/
│   │   │       └── js/
│   │   │           └── Pages/      # Halaman React Inertia Modul Certificate (Template/Index.tsx, dll.)
│   │   ├── routes/                 # Web & API routes untuk Modul Certificate
│   │   └── tests/                  # Pengujian spesifik modul
│   │
│   ├── Participant/                # Modul Pengelolaan Peserta
│   │   ├── app/
│   │   │   ├── Http/
│   │   │   │   ├── Controllers/    # ParticipantController
│   │   │   │   ├── Requests/       # StoreParticipantRequest, dll.
│   │   │   │   └── Resources/      # ParticipantResource
│   │   │   ├── Models/             # Participant
│   │   │   ├── Providers/          # ParticipantServiceProvider
│   │   │   ├── Repositories/       # Contract & Eloquent Repositories
│   │   │   └── Services/           # Contract & Service Implementation
│   │   ├── config/
│   │   ├── database/
│   │   │   └── migrations/         # Migrasi tabel participants
│   │   ├── resources/
│   │   │   └── assets/
│   │   │       └── js/
│   │   │           └── Pages/      # Halaman React Inertia Modul Participant (Index.tsx, dll.)
│   │   └── routes/
│   │
│   └── UserAccess/                 # Modul Manajemen Pengguna & Hak Akses (RBAC)
│       ├── app/
│       │   ├── Http/
│       │   │   └── Controllers/    # UserAccessController
│       │   ├── Models/
│       │   ├── Providers/          # UserAccessServiceProvider
│       │   ├── Repositories/
│       │   └── Services/
│       ├── config/
│       ├── database/
│       ├── resources/
│       └── routes/
│
├── public/                         # Public Assets (index.php, media, favicon)
├── resources/                      # Assets Frontend Utama & Root Inertia
│   ├── css/                        # Tailwind CSS App Entry Point (app.css)
│   ├── js/                         # Client-side React Application
│   │   ├── actions/                # Auto-generated Wayfinder route actions
│   │   ├── assets/                 # Gambar/Asset Statis
│   │   ├── Components/             # Komponen React Reusable (UI Elements, Modals, Forms)
│   │   ├── Layouts/                # Layout Utama (AuthenticatedLayout, GuestLayout)
│   │   ├── lib/                    # Helpers JS/TS (utils, formatters)
│   │   ├── Pages/                  # Root Inertia Pages (Dashboard.tsx, Welcome.tsx, Auth/, Profile/)
│   │   ├── routes/                 # Generated Typed Routes (Wayfinder)
│   │   ├── types/                  # Definition TypeScript Types (global.d.ts, index.d.ts)
│   │   ├── wayfinder/              # Konfigurasi & Helper Laravel Wayfinder
│   │   ├── app.tsx                 # Entrypoint Inertia React App & Module Resolver
│   │   └── bootstrap.ts            # Bootstrapping Axios & HTTP Setup
│   └── views/                      # Base Blade Template (app.blade.php)
├── routes/                         # Route Utama Aplikasi
│   ├── auth.php                    # Route Otentikasi (Login, Register, Password Reset)
│   ├── console.php                 # Command Artisan Console
│   └── web.php                     # Route Utama Web
├── storage/                        # Storage File, Cache, Logs, Generated PDF Certificates
├── tests/                          # Automated Tests (Pest PHP / PHPUnit)
│   ├── Feature/
│   └── Unit/
├── .env                            # Environment Configuration
├── composer.json                   # Dependensi PHP & Package Configuration
├── eslint.config.js                # Konfigurasi ESLint
├── package.json                    # Dependensi NPM & Script Build Vite
├── phpstan.neon                    # Konfigurasi Static Analysis PHPStan / Larastan
├── pint.json                       # Konfigurasi Code Style Formatter (Laravel Pint)
├── postcss.config.js               # Konfigurasi PostCSS
├── tailwind.config.js              # Konfigurasi Tailwind CSS
├── tsconfig.json                   # Konfigurasi TypeScript Compiler
└── vite.config.ts                  # Konfigurasi Vite & Inertia Module Resolver
```

---

## 🛠️ Stack Teknologi

- **Backend**: Laravel 13.x (PHP 8.3+)
- **Frontend**: React 19, Inertia.js v2/v3, TypeScript, Tailwind CSS v4
- **Modular Monolith**: `nwidart/laravel-modules` v13
- **Primary Key**: ULID (`Illuminate\Database\Eloquent\Concerns\HasUlids`)
- **Fitur Utama Backend**:
  - `spatie/laravel-medialibrary` untuk manajemen berkas template & media
  - `spatie/laravel-permission` untuk Role Based Access Control (RBAC)
  - `laravel/wayfinder` untuk tipe rute otomatis di TypeScript
  - `laravel/sanctum` untuk token API
  - `pestphp/pest` untuk pengujian otomatis
