<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InformasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $informasis = [
            [
                'judul' => 'Pola Makan Sehat untuk Diabetes',
                'deskripsi' => 'Ketahui jenis makanan yang baik dikonsumsi penderita diabetes, seperti sayuran tinggi serat, protein tanpa lemak, dan karbohidrat kompleks.',
                'created_at' => now()->subDays(13),
                'updated_at' => now()->subDays(13),
            ],
            [
                'judul' => 'Manfaat Olahraga bagi Penderita Diabetes',
                'deskripsi' => 'Olahraga rutin dapat membantu menjaga gula darah tetap stabil, meningkatkan sensitivitas insulin, dan menjaga berat badan ideal.',
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ],
            [
                'judul' => 'Cara Cek Gula Darah di Rumah',
                'deskripsi' => 'Panduan mudah melakukan cek gula darah secara mandiri agar pengguna dapat memantau kondisi tubuh dengan lebih teratur.',
                'created_at' => now()->subDays(17),
                'updated_at' => now()->subDays(17),
            ],
            [
                'judul' => 'Pentingnya Minum Air Putih',
                'deskripsi' => 'Air putih membantu tubuh tetap terhidrasi dan mendukung proses metabolisme, termasuk dalam menjaga keseimbangan gula darah.',
                'created_at' => now()->subDays(20),
                'updated_at' => now()->subDays(20),
            ],
        ];

        foreach ($informasis as $informasi) {
            DB::table('informasis')->updateOrInsert(
                ['judul' => $informasi['judul']],
                $informasi
            );
        }
    }
}
