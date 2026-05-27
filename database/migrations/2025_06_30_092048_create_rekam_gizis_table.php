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
        Schema::create('rekam_gizi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengguna_id')->constrained('pengguna');
            $table->float('imt');
            $table->string('status_gizi');
            $table->float('bmr');
            $table->float('tee');
            $table->float('kalori_total');
            $table->float('karbohidrat');
            $table->float('protein');
            $table->float('lemak');
            $table->dateTime('tanggal');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekam_gizi');
    }
};
