<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Certificate Templates Table
        Schema::create('certificate_templates', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->json('placeholders')->nullable(); // Posisi koordinat text (Nama, NIK, Peran, dll)
            $table->string('orientation', 20)->default('landscape'); // landscape / portrait
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Certificate Batches Table
        Schema::create('certificate_batches', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('batch_number')->unique();
            $table->string('title'); // Nama acara / kegiatan
            $table->foreignUlid('template_id')->constrained('certificate_templates')->cascadeOnDelete();
            $table->date('event_date')->nullable();
            $table->integer('total_recipients')->default(0);
            $table->integer('processed_recipients')->default(0);
            $table->string('status', 30)->default('pending'); // pending, processing, completed, failed
            $table->foreignUlid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 3. Certificates Table
        Schema::create('certificates', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('certificate_number')->unique();
            $table->foreignUlid('batch_id')->constrained('certificate_batches')->cascadeOnDelete();
            $table->foreignUlid('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->string('role_title')->default('Peserta'); // Peserta, Pemateri, Panitia
            $table->string('file_path')->nullable(); // Path PDF ter-generate
            $table->string('qr_code_path')->nullable();
            $table->string('verification_code', 64)->unique();
            $table->string('status', 30)->default('issued'); // issued, revoked
            $table->timestamp('issued_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('certificate_batches');
        Schema::dropIfExists('certificate_templates');
    }
};
