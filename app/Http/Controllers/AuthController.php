<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function formLogin()
    {
        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required'],
            'password' => ['required']
        ]);

        $credentials = $request->only('username', 'password');

        if(auth()->attempt($credentials)){
            return redirect()->route('index');
        }

        return back()->withErrors([
            'username' => 'The provided credentials do not match our records.',
        ]);
    }

    public function logout() {
        auth()->logout();
        return redirect()->route('auth.login.form');
    }

    public function formDaftar() {
        return Inertia::render('Daftar');
    }

    public function daftar(Request $request) {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')],
            'password' => ['required','min:3', 'confirmed', Password::min(3)],
            'nama' => ['required', 'string', 'max:255'],
            'foto' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
            'jenis_kelamin' => ['required', Rule::in(['Laki-laki','Perempuan'])],
            'tanggal_lahir' => ['required', 'date'],
            'tinggi_cm' => ['required', 'numeric'],
            'berat_kg' => ['required', 'numeric'],
        ]);

        $user = \App\Models\User::create([
            'username' => $data['username'],
            'password' => $data['password'],
            'nama' => $data['nama'],
            'foto' => $request->hasFile('foto') ? $request->file('foto')->storeAs('gambar/profil', $request->file('foto')->hashName(), 'public') : null,
            'role' => 'user',
        ]);

        \App\Models\Pengguna::create([
            'user_id' => $user->id,
            'jenis_kelamin' => $data['jenis_kelamin'],
            'tanggal_lahir' => $data['tanggal_lahir'],
            'tinggi_cm' => $data['tinggi_cm'],
            'berat_kg' => $data['berat_kg'],
        ]);

        return redirect()->route('auth.login.form')->with('success', 'Akun berhasil dibuat. Silakan login.');
    }
}
