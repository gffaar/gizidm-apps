<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuMakananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('menu_makanan')->insert([
            // Karbohidrat
            [
                'nama' => 'Nasi Putih',
                'kategori' => 'Karbo',
                'kalori' => 175,
                'karbohidrat' => 40.0,
                'protein' => 3.0,
                'lemak' => 0.3,
                'satuan' => '100 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Kentang Rebus',
                'kategori' => 'Karbo',
                'kalori' => 87,
                'karbohidrat' => 20.0,
                'protein' => 1.9,
                'lemak' => 0.1,
                'satuan' => '100 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Roti Gandum',
                'kategori' => 'Karbo',
                'kalori' => 69,
                'karbohidrat' => 12.0,
                'protein' => 3.0,
                'lemak' => 1.0,
                'satuan' => '1 lembar (30g)',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Protein
            [
                'nama' => 'Ayam Rebus',
                'kategori' => 'Protein',
                'kalori' => 150,
                'karbohidrat' => 0.0,
                'protein' => 15.0,
                'lemak' => 10.0,
                'satuan' => '50 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Tempe Goreng',
                'kategori' => 'Protein',
                'kalori' => 120,
                'karbohidrat' => 8.0,
                'protein' => 7.0,
                'lemak' => 7.0,
                'satuan' => '1 potong (50g)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Tahu Kukus',
                'kategori' => 'Protein',
                'kalori' => 80,
                'karbohidrat' => 2.0,
                'protein' => 8.0,
                'lemak' => 4.0,
                'satuan' => '1 potong (50g)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Ikan Panggang',
                'kategori' => 'Protein',
                'kalori' => 120,
                'karbohidrat' => 0.0,
                'protein' => 20.0,
                'lemak' => 5.0,
                'satuan' => '100 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Sayur
            [
                'nama' => 'Sayur Bayam',
                'kategori' => 'Sayur',
                'kalori' => 30,
                'karbohidrat' => 6.0,
                'protein' => 2.0,
                'lemak' => 0.2,
                'satuan' => '1 mangkuk (100g)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Wortel Rebus',
                'kategori' => 'Sayur',
                'kalori' => 35,
                'karbohidrat' => 8.0,
                'protein' => 1.0,
                'lemak' => 0.1,
                'satuan' => '100 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Brokoli Kukus',
                'kategori' => 'Sayur',
                'kalori' => 35,
                'karbohidrat' => 7.0,
                'protein' => 2.5,
                'lemak' => 0.3,
                'satuan' => '100 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Buah
            [
                'nama' => 'Apel Merah',
                'kategori' => 'Buah',
                'kalori' => 95,
                'karbohidrat' => 25.0,
                'protein' => 0.5,
                'lemak' => 0.3,
                'satuan' => '1 buah (150g)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Pisang Ambon',
                'kategori' => 'Buah',
                'kalori' => 105,
                'karbohidrat' => 27.0,
                'protein' => 1.3,
                'lemak' => 0.3,
                'satuan' => '1 buah (118g)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Pepaya',
                'kategori' => 'Buah',
                'kalori' => 43,
                'karbohidrat' => 11.0,
                'protein' => 0.5,
                'lemak' => 0.1,
                'satuan' => '100 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Lemak sehat
            [
                'nama' => 'Alpukat',
                'kategori' => 'Lemak',
                'kalori' => 160,
                'karbohidrat' => 8.5,
                'protein' => 2.0,
                'lemak' => 14.7,
                'satuan' => '100 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Kacang Almond',
                'kategori' => 'Lemak',
                'kalori' => 576,
                'karbohidrat' => 21.0,
                'protein' => 21.0,
                'lemak' => 49.0,
                'satuan' => '100 gram',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Lain-lain
            [
                'nama' => 'Susu Rendah Lemak',
                'kategori' => 'Lain-lain',
                'kalori' => 100,
                'karbohidrat' => 12.0,
                'protein' => 8.0,
                'lemak' => 2.0,
                'satuan' => '200 ml',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Telur Rebus',
                'kategori' => 'Protein',
                'kalori' => 77,
                'karbohidrat' => 0.6,
                'protein' => 6.3,
                'lemak' => 5.3,
                'satuan' => '1 butir',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Yogurt Plain',
                'kategori' => 'Lain-lain',
                'kalori' => 59,
                'karbohidrat' => 3.6,
                'protein' => 10.0,
                'lemak' => 0.4,
                'satuan' => '100 ml',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

    }
}
