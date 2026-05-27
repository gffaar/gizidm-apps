<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Admin
        if (auth()->user()->role == 'admin') {
            $banyakPasien = \App\Models\Pengguna::count();
            $banyakRekamGizi = \App\Models\RekamGizi::count();
            $banyakMenuRekomendasi = \App\Models\MenuRekomendasi::count();
            $banyakMenuMakanan = \App\Models\MenuMakanan::count();
            $banyakInformasi = \Illuminate\Support\Facades\Schema::hasTable('informasis')
                ? \App\Models\Informasi::count()
                : 0;

            return Inertia::render('Admin/Dashboard', [
                'data' => [
                    'banyakPasien' => $banyakPasien,
                    'banyakRekamGizi' => $banyakRekamGizi,
                    'banyakMenuRekomendasi' => $banyakMenuRekomendasi,
                    'banyakMenuMakanan' => $banyakMenuMakanan,
                    'banyakInformasi' => $banyakInformasi,
                ]
            ]);
        } else {
            $user = auth()->user();
            $pengguna = $user->pengguna;
            $profilUser = $user->profilUser;
            $rekamGiziTerbaru = $pengguna
                ? \App\Models\RekamGizi::where('pengguna_id', '=', $pengguna->id)->latest()->first()
                : null;

            return Inertia::render('User/Dashboard', [
                'user' => $user,
                'pengguna' => $pengguna ? $pengguna->load('user') : null,
                'profilUser' => $profilUser,
                'rekamGiziTerbaru' => $rekamGiziTerbaru,
            ]);
        }
    }
}
