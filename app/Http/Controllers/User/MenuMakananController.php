<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\MenuMakanan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuMakananController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request()->query('search');
        $menuMakanan = MenuMakanan::query()->when(
            $search,
            fn($query) =>
            $query->where('nama', 'like', '%' . $search . '%')
        )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User/Makanan/Index', [
            'makanans' => $menuMakanan,
            'filters' => request()->only(['search']),
        ]);
    }

    public function show(MenuMakanan $menuMakanan) {
        return Inertia::render('User/Makanan/Show', [
            'makanan' => $menuMakanan
        ]);
    }
}
