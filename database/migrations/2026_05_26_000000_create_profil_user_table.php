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
        Schema::create('profil_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('umur')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable();
            $table->float('berat_kg')->nullable();
            $table->float('tinggi_cm')->nullable();
            $table->float('bmi')->nullable();
            $table->float('kadar_gula_darah')->nullable();
            $table->enum('riwayat_diabetes', ['Ya', 'Tidak', 'Tidak tahu'])->nullable();
            $table->enum('aktivitas_fisik', ['Rendah', 'Sedang', 'Tinggi'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_user');
    }
};
