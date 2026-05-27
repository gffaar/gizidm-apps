<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuMakanan;
use App\Models\MenuRekomendasi;
use App\Models\Pengguna;
use App\Models\RekamGizi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuRekomendasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Pengguna $pengguna)
    {
        $search = request()->query('search');

        $rekamGizi = $pengguna->rekamGiziTerbaru;

        if($rekamGizi === null) {
            $rekamGizi = (object) [
                'imt' => 0,
                'status_gizi' => '',
                'bmr' => 0,
                'tee' => 0,
                'kalori_total' => 0,
                'karbohidrat' => 0,
                'protein' => 0,
                'lemak' => 0,
                'tanggal' => '',
            ];
        }

        $menuRekomendasi = MenuRekomendasi::query()->when(
            $search,
            fn($query) =>
            $query->where('waktu_makan', '=', $search)
        )
            ->where('pengguna_id', $pengguna->id)
            ->latest()
            ->get()
            ->load('menuMakanan');

        $kalori = 0;
        $karbohidrat = 0;
        $protein = 0;
        $lemak = 0;

        foreach ($menuRekomendasi as $menu) {
            $kalori += $menu->menuMakanan->kalori * $menu->jumlah;
            $karbohidrat += $menu->menuMakanan->karbohidrat * $menu->jumlah;
            $protein += $menu->menuMakanan->protein * $menu->jumlah;
            $lemak += $menu->menuMakanan->lemak * $menu->jumlah;
        }

        return Inertia::render("Admin/Pengguna/Rekomendasi/Index", [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi,
            'menuRekomendasi' => $menuRekomendasi,
            'filters' => request()->only(['search']),
            'total' => [
                'kalori' => $kalori,
                'karbohidrat' => $karbohidrat,
                'protein' => $protein,
                'lemak' => $lemak,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Pengguna $pengguna)
    {
        $menuMakanan = MenuMakanan::all();

        $rekamGizi = $pengguna->rekamGiziTerbaru;

        return Inertia::render("Admin/Pengguna/Rekomendasi/Create", [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi,
            'menuMakanan' => $menuMakanan,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Pengguna $pengguna)
    {
        $data = $request->validate([
            'menu_makanan_id' => ['required', Rule::exists('menu_makanan', 'id')],
            'jumlah' => ['required', 'numeric'],
            'waktu_makan' => ['required', Rule::in(['Pagi', 'Siang', 'Malam'])],
        ]);

        $data['pengguna_id'] = $pengguna->id;

        $menuRekomendasi = MenuRekomendasi::create($data);

        return redirect()->route('admin.pengguna.menu-rekomendasi.index', $pengguna)->with('success', 'Menu rekomendasi berhasil ditambahkan');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengguna $pengguna, MenuRekomendasi $menuRekomendasi)
    {
        $menuRekomendasi->delete();

        return redirect()->route('admin.pengguna.menu-rekomendasi.index', $pengguna)->with('success', 'Menu rekomendasi berhasil dihapus');
    }

    public function otomatisPilih(Request $request, Pengguna $pengguna, RekamGizi $rekamGizi)
    {
        $userId = $rekamGizi->pengguna_id;

        try {
            DB::beginTransaction();
            
            // Hapus rekomendasi sebelumnya untuk hari ini
            MenuRekomendasi::where('pengguna_id', $userId)->delete();
            
            // Generate rekomendasi untuk setiap waktu makan
            $waktuMakan = ['Pagi', 'Siang', 'Malam'];
            $pembagianKalori = [
                'Pagi' => 0.3,   // 30% dari total kalori
                'Siang' => 0.4,  // 40% dari total kalori  
                'Malam' => 0.3   // 30% dari total kalori
            ];
            
            $allRekomendasi = [];
            
            foreach ($waktuMakan as $waktu) {
                $targetKalori = $rekamGizi->kalori_total * $pembagianKalori[$waktu];
                $targetKarbo = $rekamGizi->karbohidrat * $pembagianKalori[$waktu];
                $targetProtein = $rekamGizi->protein * $pembagianKalori[$waktu];
                $targetLemak = $rekamGizi->lemak * $pembagianKalori[$waktu];
                
                $rekomendasi = $this->greedyAlgorithm([
                    'kalori' => $targetKalori,
                    'karbohidrat' => $targetKarbo,
                    'protein' => $targetProtein,
                    'lemak' => $targetLemak
                ], $waktu);
                
                $allRekomendasi[$waktu] = $rekomendasi;
                
                // Simpan rekomendasi ke database
                foreach ($rekomendasi as $item) {
                    MenuRekomendasi::create([
                        'pengguna_id' => $userId,
                        'menu_makanan_id' => $item['menu_makanan_id'],
                        'jumlah' => $item['jumlah'],
                        'waktu_makan' => $waktu
                    ]);
                }
            }
            
            DB::commit();
            
            return redirect()->route('admin.pengguna.menu-rekomendasi.index', [$pengguna])->with('success', 'Rekomendasi menu berhasil dibuat');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat membuat rekomendasi menu: ' . $e->getMessage());
        }
    }

    
    
    private function greedyAlgorithm($targets, $waktuMakan)
    {
        // Ambil semua menu makanan yang tersedia
        $menuMakanan = MenuMakanan::all();
        
        $selectedItems = [];
        $currentNutrition = [
            'kalori' => 0,
            'karbohidrat' => 0,
            'protein' => 0,
            'lemak' => 0
        ];
        
        // Strategi greedy berdasarkan waktu makan
        $priorityCategories = $this->getCategoryPriority($waktuMakan);
        
        // Urutkan menu berdasarkan prioritas kategori dan efisiensi nutrisi
        $sortedMenu = $this->sortMenuByPriority($menuMakanan, $priorityCategories, $targets);
        
        foreach ($sortedMenu as $menu) {
            // Cek apakah masih membutuhkan nutrisi yang ada di menu ini
            if ($this->shouldAddMenu($menu, $currentNutrition, $targets)) {
                // Hitung jumlah porsi optimal
                $optimalPortion = $this->calculateOptimalPortion($menu, $currentNutrition, $targets);
                
                if ($optimalPortion > 0) {
                    $selectedItems[] = [
                        'menu_makanan_id' => $menu->id,
                        'nama' => $menu->nama,
                        'kategori' => $menu->kategori,
                        'jumlah' => round($optimalPortion, 2),
                        'satuan' => $menu->satuan,
                        'kalori_total' => $menu->kalori * $optimalPortion,
                        'karbohidrat_total' => $menu->karbohidrat * $optimalPortion,
                        'protein_total' => $menu->protein * $optimalPortion,
                        'lemak_total' => $menu->lemak * $optimalPortion
                    ];
                    
                    // Update current nutrition
                    $currentNutrition['kalori'] += $menu->kalori * $optimalPortion;
                    $currentNutrition['karbohidrat'] += $menu->karbohidrat * $optimalPortion;
                    $currentNutrition['protein'] += $menu->protein * $optimalPortion;
                    $currentNutrition['lemak'] += $menu->lemak * $optimalPortion;
                }
            }
            
            // Stop jika sudah mendekati target atau sudah cukup item
            if ($this->isTargetReached($currentNutrition, $targets) || count($selectedItems) >= 5) {
                break;
            }
        }
        
        return $selectedItems;
    }
    
    private function getCategoryPriority($waktuMakan)
    {
        switch ($waktuMakan) {
            case 'Pagi':
                return ['Karbo', 'Protein', 'Buah', 'Snack', 'Sayur', 'Lemak'];
            case 'Siang':
                return ['Protein', 'Karbo', 'Sayur', 'Lemak', 'Buah', 'Snack'];
            case 'Malam':
                return ['Protein', 'Sayur', 'Karbo', 'Lemak', 'Buah', 'Snack'];
            default:
                return ['Karbo', 'Protein', 'Sayur', 'Lemak', 'Buah', 'Snack'];
        }
    }
    
    private function sortMenuByPriority($menuMakanan, $priorityCategories, $targets)
    {
        return $menuMakanan->sortBy(function ($menu) use ($priorityCategories, $targets) {
            // Priority score berdasarkan kategori
            $categoryScore = array_search($menu->kategori, $priorityCategories);
            if ($categoryScore === false) $categoryScore = 999;
            
            // Efficiency score berdasarkan nutrisi per kalori
            $efficiencyScore = 0;
            if ($menu->kalori > 0) {
                $efficiencyScore = (
                    ($menu->karbohidrat / $menu->kalori) * ($targets['karbohidrat'] / $targets['kalori']) +
                    ($menu->protein / $menu->kalori) * ($targets['protein'] / $targets['kalori']) +
                    ($menu->lemak / $menu->kalori) * ($targets['lemak'] / $targets['kalori'])
                ) / 3;
            }
            
            // Kombinasi category priority dan efficiency (semakin kecil semakin baik)
            return $categoryScore - ($efficiencyScore * 10);
        })->values();
    }
    
    private function shouldAddMenu($menu, $currentNutrition, $targets)
    {
        // Cek apakah masih membutuhkan nutrisi yang bisa dipenuhi menu ini
        $needsKalori = $currentNutrition['kalori'] < $targets['kalori'];
        $needsKarbo = $currentNutrition['karbohidrat'] < $targets['karbohidrat'];
        $needsProtein = $currentNutrition['protein'] < $targets['protein'];
        $needsLemak = $currentNutrition['lemak'] < $targets['lemak'];
        
        // Menu berguna jika bisa memenuhi minimal salah satu kebutuhan
        return ($needsKalori && $menu->kalori > 0) ||
               ($needsKarbo && $menu->karbohidrat > 0) ||
               ($needsProtein && $menu->protein > 0) ||
               ($needsLemak && $menu->lemak > 0);
    }
    
    private function calculateOptimalPortion($menu, $currentNutrition, $targets)
    {
        $portions = [];
        
        // Hitung porsi berdasarkan setiap nutrisi
        if ($menu->kalori > 0) {
            $remainingKalori = max(0, $targets['kalori'] - $currentNutrition['kalori']);
            $portions[] = $remainingKalori / $menu->kalori;
        }
        
        if ($menu->karbohidrat > 0) {
            $remainingKarbo = max(0, $targets['karbohidrat'] - $currentNutrition['karbohidrat']);
            $portions[] = $remainingKarbo / $menu->karbohidrat;
        }
        
        if ($menu->protein > 0) {
            $remainingProtein = max(0, $targets['protein'] - $currentNutrition['protein']);
            $portions[] = $remainingProtein / $menu->protein;
        }
        
        if ($menu->lemak > 0) {
            $remainingLemak = max(0, $targets['lemak'] - $currentNutrition['lemak']);
            $portions[] = $remainingLemak / $menu->lemak;
        }
        
        if (empty($portions)) {
            return 0;
        }
        
        // Ambil porsi minimum untuk menghindari overshoot
        $optimalPortion = min($portions);
        
        // Batasi minimum dan maksimum porsi
        return max(0.1, min($optimalPortion, 3.0));
    }
    
    private function isTargetReached($currentNutrition, $targets)
    {
        $tolerance = 0.9; // 90% dari target
        
        return $currentNutrition['kalori'] >= ($targets['kalori'] * $tolerance) &&
               $currentNutrition['karbohidrat'] >= ($targets['karbohidrat'] * $tolerance) &&
               $currentNutrition['protein'] >= ($targets['protein'] * $tolerance) &&
               $currentNutrition['lemak'] >= ($targets['lemak'] * $tolerance);
    }
}
