<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use App\Models\ProfilUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InformasiDataPribadiUserController extends Controller
{
    /**
     * Display the personal data information form.
     */
    public function index()
    {
        $user = auth()->user();
        $user->load(['pengguna', 'profilUser']);

        return Inertia::render('User/InformasiDataPribadiUser/Index', [
            'user' => $user,
            'profil' => $user->pengguna,
            'profilUser' => ProfilUser::where('user_id', $user->id)->first(),
        ]);
    }

    /**
     * Store or update the personal data information.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore(auth()->user()->id)],
            'nama' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['nullable', 'string', Rule::in(['Laki-laki', 'Perempuan'])],
            'tanggal_lahir' => ['nullable', 'date'],
            'tinggi_cm' => ['nullable', 'numeric', 'min:0'],
            'berat_kg' => ['nullable', 'numeric', 'min:0'],
            'umur' => ['nullable', 'integer', 'min:0', 'max:150'],
            'kadar_gula_darah' => ['nullable', 'numeric', 'min:0'],
            'riwayat_diabetes' => ['nullable', 'string', Rule::in(['Ya', 'Tidak', 'Tidak tahu'])],
            'aktivitas_fisik' => ['nullable', 'string', Rule::in(['Rendah', 'Sedang', 'Tinggi'])],
            'foto' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $user = auth()->user();
        $user->fill([
            'username' => $validated['username'],
            'nama' => $validated['nama'],
        ]);

        if ($request->hasFile('foto')) {
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }

            $foto = $request->file('foto');
            $user->foto = $foto->storeAs('gambar/profil', $foto->hashName(), 'public');
        }

        $user->save();

        if ($user->role === 'user') {
            $bmi = $this->calculateBmi(
                $validated['berat_kg'] ?? null,
                $validated['tinggi_cm'] ?? null
            );

            ProfilUser::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                    'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                    'umur' => $validated['umur'] ?? $this->calculateAge($validated['tanggal_lahir'] ?? null),
                    'tinggi_cm' => $validated['tinggi_cm'] ?? null,
                    'berat_kg' => $validated['berat_kg'] ?? null,
                    'bmi' => $bmi,
                    'kadar_gula_darah' => $validated['kadar_gula_darah'] ?? null,
                    'riwayat_diabetes' => $validated['riwayat_diabetes'] ?? null,
                    'aktivitas_fisik' => $validated['aktivitas_fisik'] ?? null,
                ]
            );

            $penggunaData = [
                'jenis_kelamin' => $validated['jenis_kelamin'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
                'tinggi_cm' => $validated['tinggi_cm'] ?? null,
                'berat_kg' => $validated['berat_kg'] ?? null,
            ];

            if ($this->isCompletePenggunaData($penggunaData)) {
                Pengguna::updateOrCreate(
                    ['user_id' => $user->id],
                    $penggunaData
                );
            }
        }

        return redirect()
            ->route('informasi-data-pribadi-user.index')
            ->with('success', 'Informasi data pribadi berhasil diperbarui.');
    }

    private function calculateBmi($beratKg, $tinggiCm): ?float
    {
        if (! $beratKg || ! $tinggiCm || $tinggiCm <= 0) {
            return null;
        }

        $tinggiMeter = $tinggiCm / 100;

        return round($beratKg / ($tinggiMeter * $tinggiMeter), 2);
    }

    private function calculateAge($tanggalLahir): ?int
    {
        if (! $tanggalLahir) {
            return null;
        }

        return (int) now()->diffInYears(\Illuminate\Support\Carbon::parse($tanggalLahir));
    }

    private function isCompletePenggunaData(array $data): bool
    {
        foreach ($data as $value) {
            if ($value === null || $value === '') {
                return false;
            }
        }

        return true;
    }
}
