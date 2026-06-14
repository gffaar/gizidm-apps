<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'password' => bcrypt('admin'),
                'role' => 'admin',
                'nama' => 'Admin',
            ],
        );

        $this->call([
            MenuMakananSeeder::class,
            InformasiSeeder::class,
        ]);
    }
}
