<?php

namespace Database\Seeders;

use App\Models\Pengguna;
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

        User::create([
            'username' => 'admin',
            'password' => bcrypt('admin'),
            'role' => 'admin',
            'nama' => 'Admin',
        ]);

        $user = User::create([
            'username' => 'user',
            'password' => bcrypt('user'),
            'role' => 'user',
            'nama' => 'User',
        ]);

        $pengguna = Pengguna::factory()->create([
            'user_id' => $user->id,
        ]);

        for($i = 0; $i < 20; $i++) {
            $user = User::create([
                'username' => 'user' . $i,
                'password' => bcrypt('user' . $i),
                'role' => 'user',
                'nama' => fake()->name(),
            ]);

            $pengguna = Pengguna::factory()->create([
                'user_id' => $user->id,
            ]);
        }

        $this->call([
            MenuMakananSeeder::class,
            InformasiSeeder::class,
        ]);
    }
}
