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
        if (! Schema::hasTable('informasis')) {
            Schema::create('informasis', function (Blueprint $table) {
                $table->id();
                $table->string('judul');
                $table->text('deskripsi');
                $table->string('gambar')->nullable();
                $table->timestamps();
            });

            return;
        }

        Schema::table('informasis', function (Blueprint $table) {
            if (! Schema::hasColumn('informasis', 'judul')) {
                $table->string('judul')->after('id');
            }

            if (! Schema::hasColumn('informasis', 'deskripsi')) {
                $table->text('deskripsi')->after('judul');
            }

            if (! Schema::hasColumn('informasis', 'gambar')) {
                $table->string('gambar')->nullable()->after('deskripsi');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('informasis')) {
            Schema::table('informasis', function (Blueprint $table) {
                foreach (['gambar', 'deskripsi', 'judul'] as $column) {
                    if (Schema::hasColumn('informasis', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }
    }
};
