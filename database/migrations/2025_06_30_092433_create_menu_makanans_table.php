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
        Schema::create('menu_makanan', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->index();
            $table->enum('kategori', ['Karbo', 'Protein', 'Lemak', 'Sayur', 'Buah', 'Lain-lain']);
            $table->float('kalori');
            $table->float('karbohidrat');
            $table->float('protein');
            $table->float('lemak');
            $table->string('satuan');
            $table->string('gambar')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_makanan');
    }
};
