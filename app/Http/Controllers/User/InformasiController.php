<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Informasi;
use Inertia\Inertia;

class InformasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $informasis = Informasi::latest()->paginate(10)->withQueryString();

        return Inertia::render('User/Informasi/Index', [
            'informasis' => $informasis,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Informasi $informasi)
    {
        return Inertia::render('User/Informasi/Show', [
            'informasi' => $informasi,
        ]);
    }
}
