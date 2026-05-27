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
        Schema::table('rekam_gizi', function (Blueprint $table) {
            $table->string('nama')->nullable()->after('pengguna_id');
            $table->string('usia')->nullable()->after('nama');
            $table->string('jenis_kelamin')->nullable()->after('usia');
            $table->float('tinggi_badan')->nullable()->after('jenis_kelamin');
            $table->float('berat_badan')->nullable()->after('tinggi_badan');
            $table->string('riwayat_diabetes')->nullable()->after('berat_badan');
            $table->float('kadar_gula_darah')->nullable()->after('lemak');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rekam_gizi', function (Blueprint $table) {
            $table->dropColumn('nama');
            $table->dropColumn('usia');
            $table->dropColumn('jenis_kelamin');
            $table->dropColumn('tinggi_badan');
            $table->dropColumn('berat_badan');
            $table->dropColumn('riwayat_diabetes');
            $table->dropColumn('kadar_gula_darah');
        });
    }
};
