<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\MenuMakanan;
use App\Models\MenuRekomendasi;
use App\Models\Pengguna;
use App\Models\RekamGizi;
use App\Services\MenuRecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MenuRekomendasiController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $pengguna = $user->pengguna;

        if (! $pengguna) {
            return redirect()
                ->route('informasi-data-pribadi-user.index')
                ->with('error', 'Lengkapi data pribadi terlebih dahulu.');
        }

        $rekamGizi = $this->todayRekamGizi($pengguna->id);

        if (! $rekamGizi) {
            return $this->dailyCalculationRequiredResponse($pengguna);
        }

        $search = $request->query('search');
        $dailyRecommendationQuery = MenuRekomendasi::with('menuMakanan')
            ->where('pengguna_id', $pengguna->id)
            ->whereDate('created_at', today());
        $hasDailyRecommendation = (clone $dailyRecommendationQuery)->exists();
        $dailyRecommendations = (clone $dailyRecommendationQuery)
            ->orderByRaw("CASE waktu_makan WHEN 'Pagi' THEN 1 WHEN 'Siang' THEN 2 WHEN 'Malam' THEN 3 ELSE 4 END")
            ->orderBy('id')
            ->get();
        $menuRekomendasi = $search
            ? $dailyRecommendations->where('waktu_makan', $search)->values()
            : $dailyRecommendations;

        if (
            ! $request->boolean('auto')
            && MenuMakanan::query()->exists()
            && (
                ! $hasDailyRecommendation
                || $this->recommendationsNeedRefresh($dailyRecommendations, $rekamGizi)
            )
        ) {
            return redirect()->route('user.menu-rekomendasi.otomatis-pilih', [
                'rekamGizi' => $rekamGizi->id,
            ]);
        }

        return Inertia::render('User/Rekomendasi/Index', [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi,
            'menuRekomendasi' => $menuRekomendasi,
            'filters' => $request->only(['search']),
            'hasMenuMakanan' => MenuMakanan::query()->exists(),
            'total' => $this->totals($menuRekomendasi),
        ]);
    }

    public function create()
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $pengguna = $user->pengguna;

        if (! $pengguna) {
            return redirect()
                ->route('informasi-data-pribadi-user.index')
                ->with('error', 'Lengkapi data pribadi terlebih dahulu.');
        }

        $rekamGizi = $this->todayRekamGizi($pengguna->id);

        if (! $rekamGizi) {
            return redirect()->route('user.menu-rekomendasi.index');
        }

        return Inertia::render('User/Rekomendasi/Create', [
            'pengguna' => $pengguna,
            'rekamGizi' => $rekamGizi,
            'menuMakanan' => MenuMakanan::orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('auth.login.form');
        }

        $pengguna = $user->pengguna;

        if (! $pengguna) {
            return redirect()
                ->route('informasi-data-pribadi-user.index')
                ->with('error', 'Lengkapi data pribadi terlebih dahulu.');
        }

        if (! $this->todayRekamGizi($pengguna->id)) {
            return redirect()
                ->route('user.menu-rekomendasi.index')
                ->with('error', 'Silakan hitung kebutuhan gizi terlebih dahulu untuk melihat rekomendasi makanan hari ini.');
        }

        $data = $request->validate([
            'menu_makanan_id' => ['required', Rule::exists('menu_makanan', 'id')],
            'jumlah' => ['required', 'numeric', 'min:0.1'],
            'waktu_makan' => ['required', Rule::in(['Pagi', 'Siang', 'Malam'])],
        ]);

        MenuRekomendasi::create($data + ['pengguna_id' => $pengguna->id]);

        return redirect()
            ->route('user.menu-rekomendasi.index')
            ->with('success', 'Menu rekomendasi berhasil ditambahkan.');
    }

    public function destroy(MenuRekomendasi $menuRekomendasi)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $pengguna = $user?->pengguna;

        abort_unless($pengguna && $menuRekomendasi->pengguna_id === $pengguna->id, 404);

        $menuRekomendasi->delete();

        return redirect()
            ->route('user.menu-rekomendasi.index')
            ->with('success', 'Menu rekomendasi berhasil dihapus.');
    }

    public function otomatisPilih(RekamGizi $rekamGizi, MenuRecommendationService $service)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $pengguna = $user?->pengguna;

        abort_unless($pengguna && $rekamGizi->pengguna_id === $pengguna->id, 404);

        if (
            ! $rekamGizi->tanggal
            || ! Carbon::parse($rekamGizi->tanggal)->isToday()
        ) {
            return redirect()->route('user.menu-rekomendasi.index');
        }

        $recommendations = $service->generate($rekamGizi);

        if ($recommendations === []) {
            return redirect()
                ->route('user.menu-rekomendasi.index', ['auto' => 1])
                ->with('error', 'Belum ada menu makanan yang bisa dipakai untuk membuat rekomendasi.');
        }

        DB::transaction(function () use ($pengguna, $recommendations) {
            MenuRekomendasi::where('pengguna_id', $pengguna->id)
                ->whereDate('created_at', today())
                ->delete();

            foreach ($recommendations as $recommendation) {
                MenuRekomendasi::create($recommendation + ['pengguna_id' => $pengguna->id]);
            }
        });

        return redirect()
            ->route('user.menu-rekomendasi.index', ['auto' => 1])
            ->with('success', 'Rekomendasi menu berhasil dibuat.');
    }

    private function todayRekamGizi(int $penggunaId): ?RekamGizi
    {
        return RekamGizi::where('pengguna_id', $penggunaId)
            ->whereDate('tanggal', today())
            ->latest('tanggal')
            ->latest('id')
            ->first();
    }

    private function dailyCalculationRequiredResponse(Pengguna $pengguna)
    {
        return Inertia::render('User/Rekomendasi/Index', [
            'pengguna' => $pengguna,
            'rekamGizi' => null,
            'menuRekomendasi' => [],
            'filters' => [],
            'hasMenuMakanan' => MenuMakanan::query()->exists(),
            'needsDailyCalculation' => true,
            'total' => [
                'kalori' => 0,
                'karbohidrat' => 0,
                'protein' => 0,
                'lemak' => 0,
            ],
        ]);
    }

    private function totals($menuRekomendasi): array
    {
        $totals = $menuRekomendasi->reduce(function (array $total, MenuRekomendasi $menu) {
            if (! $menu->menuMakanan) {
                return $total;
            }

            $total['kalori'] += $menu->menuMakanan->kalori * $menu->jumlah;
            $total['karbohidrat'] += $menu->menuMakanan->karbohidrat * $menu->jumlah;
            $total['protein'] += $menu->menuMakanan->protein * $menu->jumlah;
            $total['lemak'] += $menu->menuMakanan->lemak * $menu->jumlah;

            return $total;
        }, [
            'kalori' => 0,
            'karbohidrat' => 0,
            'protein' => 0,
            'lemak' => 0,
        ]);

        return array_map(fn ($value) => round((float) $value, 1), $totals);
    }

    private function recommendationsNeedRefresh($menuRekomendasi, RekamGizi $rekamGizi): bool
    {
        if ($menuRekomendasi->isEmpty()) {
            return true;
        }

        foreach (['Pagi', 'Siang', 'Malam'] as $mealTime) {
            $mealMenus = $menuRekomendasi->where('waktu_makan', $mealTime);

            if (
                ! $this->hasMenuCategory($mealMenus, 'Karbo')
                || ! $this->hasMenuCategory($mealMenus, 'Protein')
                || ! $this->hasMenuCategory($mealMenus, 'Sayur')
            ) {
                return true;
            }
        }

        $totals = $this->totals($menuRekomendasi);

        return $totals['kalori'] < ((float) $rekamGizi->kalori_total * 0.95)
            || $totals['kalori'] > ((float) $rekamGizi->kalori_total * 1.05)
            || $totals['karbohidrat'] < ((float) $rekamGizi->karbohidrat * 0.9)
            || $totals['karbohidrat'] > ((float) $rekamGizi->karbohidrat * 1.1)
            || $totals['protein'] < ((float) $rekamGizi->protein * 0.9)
            || $totals['protein'] > ((float) $rekamGizi->protein * 1.1)
            || $totals['lemak'] < ((float) $rekamGizi->lemak * 0.9)
            || $totals['lemak'] > ((float) $rekamGizi->lemak * 1.1);
    }

    private function hasMenuCategory($menuRekomendasi, string $expectedCategory): bool
    {
        return $menuRekomendasi->contains(function (MenuRekomendasi $menu) use ($expectedCategory) {
            if (! $menu->menuMakanan) {
                return false;
            }

            return $this->menuCategory($menu->menuMakanan) === $expectedCategory;
        });
    }

    private function menuCategory(MenuMakanan $menu): string
    {
        $category = mb_strtolower((string) $menu->kategori);
        $name = mb_strtolower((string) $menu->nama);

        if (str_contains($category, 'karbo') || $this->containsAny($name, ['nasi', 'beras', 'kentang', 'ubi', 'jagung', 'oat', 'oatmeal', 'roti', 'gandum'])) {
            return 'Karbo';
        }

        if (str_contains($category, 'protein') || $this->containsAny($name, ['ayam', 'ikan', 'telur', 'tahu', 'tempe', 'daging'])) {
            return 'Protein';
        }

        if (str_contains($category, 'sayur') || $this->containsAny($name, ['bayam', 'kangkung', 'brokoli', 'wortel', 'buncis', 'sawi', 'timun', 'tomat', 'labu'])) {
            return 'Sayur';
        }

        if (str_contains($category, 'buah') || $this->containsAny($name, ['apel', 'pepaya', 'jeruk', 'jambu', 'buah naga', 'alpukat'])) {
            return 'Buah';
        }

        return 'Lain-lain';
    }

    private function containsAny(string $text, array $keywords): bool
    {
        foreach ($keywords as $keyword) {
            $keyword = mb_strtolower(trim($keyword));

            if ($keyword === '') {
                continue;
            }

            if (str_contains($keyword, ' ')) {
                if (str_contains($text, $keyword)) {
                    return true;
                }

                continue;
            }

            if (preg_match('/(?<![\p{L}\p{N}])'.preg_quote($keyword, '/').'(?![\p{L}\p{N}])/u', $text)) {
                return true;
            }
        }

        return false;
    }
}
