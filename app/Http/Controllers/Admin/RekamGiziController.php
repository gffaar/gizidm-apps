<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengguna;
use App\Models\RekamGizi;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RekamGiziController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Pengguna $pengguna)
    {
        $rekamGizi = RekamGizi::where('pengguna_id', $pengguna->id)->orderBy('tanggal', 'desc')->get();

        return Inertia::render('Admin/Pengguna/RekamGizi/Index', [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Pengguna $pengguna)
    {
        return Inertia::render('Admin/Pengguna/RekamGizi/Create', [
            'pengguna' => $pengguna
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Pengguna $pengguna)
    {
        $data = $request->validate([
            'nama' => ['required', 'string'],
            'riwayat_diabetes' => ['required', Rule::in(['Ya', 'Tidak'])],
            'berat_kg' => ['required', 'numeric'],
            'tinggi_cm' => ['required', 'numeric'],
            'usia' => ['required', 'numeric'],
            'jenis_kelamin' => ['required', Rule::in(['Laki-laki', 'Perempuan'])],
            'aktivitas' => ['required', Rule::in(['Sangat Ringan', 'Ringan', 'Sedang', 'Berat'])],
            'kadar_gula_darah' => ['nullable', 'numeric'],
        ]);

        // Hitung IMT
        $tinggi_m = $data['tinggi_cm'] / 100;
        $imt = $data['berat_kg'] / ($tinggi_m * $tinggi_m);

        // Status gizi
        if ($imt < 18.5) {
            $status_gizi = 'Kurus';
        } elseif ($imt < 23) {
            $status_gizi = 'Normal';
        } elseif ($imt < 25) {
            $status_gizi = 'Overweight';
        } elseif ($imt < 30) {
            $status_gizi = 'Obesitas I';
        } else {
            $status_gizi = 'Obesitas II';
        }

        // Hitung BMR (Harris-Benedict)
        if ($data['jenis_kelamin'] === 'Laki-laki') {
            $bmr = 66.5 + (13.75 * $data['berat_kg']) + (5.003 * $data['tinggi_cm']) - (6.775 * $data['usia']);
        } else {
            $bmr = 655.1 + (9.563 * $data['berat_kg']) + (1.850 * $data['tinggi_cm']) - (4.676 * $data['usia']);
        }

        // Faktor aktivitas
        $faktorAktivitas = [
            'Sangat Ringan' => 1.2,
            'Ringan' => 1.4,
            'Sedang' => 1.7,
            'Berat' => 2.0,
        ];
        $tee = $bmr * $faktorAktivitas[$data['aktivitas']];

        // Kalori total (penyesuaian berdasarkan status gizi)
        $kalori = match ($status_gizi) {
            'Kurus' => $tee + 300,
            'Obesitas I', 'Obesitas II' => $tee - 500,
            default => $tee
        };

        // Distribusi makronutrien
        $karbo = (0.55 * $kalori) / 4; // gram
        $protein = (0.15 * $kalori) / 4; // gram
        $lemak = (0.30 * $kalori) / 9; // gram

        // Simpan ke database
        $rekamGizi = RekamGizi::create([
            'pengguna_id' => $pengguna->id,
            'nama' => $data['nama'],
            'usia' => $data['usia'],
            'jenis_kelamin' => $data['jenis_kelamin'],
            'tinggi_badan' => $data['tinggi_cm'],
            'berat_badan' => $data['berat_kg'],
            'riwayat_diabetes' => $data['riwayat_diabetes'],
            'imt' => round($imt, 2),
            'status_gizi' => $status_gizi,
            'bmr' => round($bmr, 2),
            'tee' => round($tee, 2),
            'kalori_total' => round($kalori, 2),
            'karbohidrat' => round($karbo, 2),
            'protein' => round($protein, 2),
            'lemak' => round($lemak, 2),
            'kadar_gula_darah' => round($data['kadar_gula_darah'],2),
            'tanggal' => now(),
        ]);

        $pengguna->update([
            'berat_kg' => $data['berat_kg'],
            'tinggi_cm' => $data['tinggi_cm'],
        ]);

        return redirect()->route('admin.pengguna.rekam-gizi.show', [$pengguna, $rekamGizi])->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pengguna $pengguna, RekamGizi $rekamGizi)
    {
        return Inertia::render('Admin/Pengguna/RekamGizi/Show', [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengguna $pengguna, RekamGizi $rekamGizi)
    {
        $rekamGizi->delete();

        return redirect()->route('admin.pengguna.rekam-gizi.index', $pengguna)->with('success', 'Data berhasil dihapus.');
    }
}
