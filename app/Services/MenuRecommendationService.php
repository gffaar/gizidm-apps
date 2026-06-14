<?php

namespace App\Services;

use App\Models\MenuMakanan;
use App\Models\RekamGizi;
use Illuminate\Support\Collection;

class MenuRecommendationService
{
    private const MAX_CANDIDATES_PER_GROUP = 8;
    private const MAX_MEAL_CANDIDATES = 14;
    private const DAILY_TOLERANCES = [
        'kalori' => 0.05,
        'karbohidrat' => 0.10,
        'protein' => 0.10,
        'lemak' => 0.10,
    ];

    public function generate(RekamGizi $rekamGizi): array
    {
        if ((float) $rekamGizi->kalori_total <= 0 || ! MenuMakanan::query()->exists()) {
            return [];
        }

        $menus = $this->diabetesFriendlyMenus();

        if ($menus->isEmpty()) {
            return [];
        }

        $dailyTargets = [
            'kalori' => (float) $rekamGizi->kalori_total,
            'karbohidrat' => (float) $rekamGizi->karbohidrat,
            'protein' => (float) $rekamGizi->protein,
            'lemak' => (float) $rekamGizi->lemak,
        ];
        $mealCandidates = [];

        foreach ($this->mealRatios() as $mealTime => $ratio) {
            $targets = [
                'kalori' => $dailyTargets['kalori'] * $ratio,
                'karbohidrat' => $dailyTargets['karbohidrat'] * $ratio,
                'protein' => $dailyTargets['protein'] * $ratio,
                'lemak' => $dailyTargets['lemak'] * $ratio,
            ];

            $mealCandidates[$mealTime] = $this->buildMealCandidates($menus, $targets);

            if ($mealCandidates[$mealTime] === []) {
                return [];
            }
        }

        $best = null;
        $this->searchBestDay($mealCandidates, array_keys($mealCandidates), 0, [], $dailyTargets, $best);

        if (! $best || $best['items'] === []) {
            return [];
        }

        $items = $this->rebalanceItems($best['items'], $dailyTargets);

        return collect($items)
            ->map(fn (array $item) => [
                'menu_makanan_id' => $item['menu']->id,
                'jumlah' => $item['portion'],
                'waktu_makan' => $item['waktu_makan'],
            ])
            ->values()
            ->all();
    }

    private function mealRatios(): array
    {
        $ratios = [
            'Pagi' => 0.25,
            'Siang' => 0.35,
            'Malam' => 0.30,
        ];

        // Schema saat ini belum memiliki waktu makan Camilan, jadi 90% target
        // utama dinormalisasi agar total harian tetap mendekati kebutuhan energi.
        $availableTotal = array_sum($ratios);

        return array_map(fn (float $ratio) => $ratio / $availableTotal, $ratios);
    }

    private function buildBalancedMeal(Collection $menus, array $targets): array
    {
        $candidates = $this->buildMealCandidates($menus, $targets, 1);

        if ($candidates === []) {
            return [];
        }

        return collect($candidates[0]['items'])
            ->map(fn (array $candidate) => [
                'menu_makanan_id' => $candidate['menu']->id,
                'jumlah' => $candidate['portion'],
            ])
            ->values()
            ->all();
    }

    private function buildMealCandidates(Collection $menus, array $targets, ?int $limit = null): array
    {
        $groups = $this->groupMenus($menus);
        $candidateSets = [];

        foreach (['Karbo', 'Protein', 'Sayur'] as $role) {
            $candidates = $this->bestCandidates($groups[$role], $role, $targets);

            if ($candidates === []) {
                return [];
            }

            $candidateSets[] = $candidates;
        }

        $fruitCandidates = $this->bestCandidates($groups['Buah'], 'Buah', $targets);

        if ($fruitCandidates !== []) {
            $candidateSets[] = $candidateSets === []
                ? $fruitCandidates
                : array_merge([null], $fruitCandidates);
        }

        $fatCandidates = $this->bestCandidates($this->healthyFatCandidates($menus, $groups), 'Lemak', $targets);

        if ($fatCandidates !== []) {
            $candidateSets[] = array_merge([null], $fatCandidates);
        }

        if ($candidateSets === []) {
            return [];
        }

        $results = [];
        $this->collectMealCombinations($candidateSets, 0, [], $targets, $results);

        return collect($results)
            ->sortBy('score')
            ->take($limit ?? self::MAX_MEAL_CANDIDATES)
            ->values()
            ->all();
    }

    private function groupMenus(Collection $menus): array
    {
        $groups = [
            'Karbo' => collect(),
            'Protein' => collect(),
            'Sayur' => collect(),
            'Buah' => collect(),
            'Lemak' => collect(),
            'Lain-lain' => collect(),
        ];

        foreach ($menus as $menu) {
            $groups[$this->classifyMenu($menu)]->push($menu);
        }

        return $groups;
    }

    private function classifyMenu(MenuMakanan $menu): string
    {
        $category = mb_strtolower((string) $menu->kategori);
        $name = mb_strtolower((string) $menu->nama);

        if (str_contains($category, 'karbo') || $this->containsAny($name, [
            'nasi',
            'beras',
            'kentang',
            'ubi',
            'jagung',
            'oat',
            'oatmeal',
            'roti',
            'gandum',
        ])) {
            return 'Karbo';
        }

        if (str_contains($category, 'protein') || $this->containsAny($name, [
            'ayam',
            'ikan',
            'telur',
            'tahu',
            'tempe',
            'daging',
        ])) {
            return 'Protein';
        }

        if (str_contains($category, 'sayur') || $this->containsAny($name, [
            'bayam',
            'kangkung',
            'brokoli',
            'wortel',
            'buncis',
            'sawi',
            'timun',
            'tomat',
            'labu',
        ])) {
            return 'Sayur';
        }

        if (str_contains($category, 'buah') || $this->containsAny($name, [
            'apel',
            'pepaya',
            'jeruk',
            'jambu',
            'buah naga',
            'alpukat',
        ])) {
            return 'Buah';
        }

        if (str_contains($category, 'lemak')) {
            return 'Lemak';
        }

        return 'Lain-lain';
    }

    private function healthyFatCandidates(Collection $menus, array $groups): Collection
    {
        return $groups['Lemak']
            ->merge($menus->filter(fn (MenuMakanan $menu) => $this->containsAny(
                mb_strtolower((string) $menu->nama),
                ['alpukat', 'kacang', 'almond', 'ikan', 'telur', 'tempe']
            )))
            ->unique('id')
            ->values();
    }

    private function bestCandidates(Collection $menus, string $role, array $targets): array
    {
        return $menus
            ->flatMap(function (MenuMakanan $menu) use ($role) {
                return collect($this->portionOptions($menu, $role))
                    ->map(fn (float $portion) => [
                        'menu' => $menu,
                        'role' => $role,
                        'portion' => $portion,
                        'nutrition' => $this->nutritionForPortion($menu, $portion),
                    ]);
            })
            ->sortBy(fn (array $candidate) => $this->candidateScore($candidate, $targets))
            ->take(self::MAX_CANDIDATES_PER_GROUP)
            ->values()
            ->all();
    }

    private function portionOptions(MenuMakanan $menu, string $role): array
    {
        $bounds = $this->portionBounds($menu, $role);
        $options = [];

        for ($portion = $bounds['min']; $portion <= $bounds['max'] + 0.0001; $portion += $bounds['step']) {
            $options[] = round($portion, 2);
        }

        return array_values(array_unique($options));
    }

    private function portionBounds(MenuMakanan $menu, string $role): array
    {
        $serving = $this->servingInfo($menu);
        $label = $serving['label'];
        $weight = $serving['weight'];

        if ($role === 'Karbo') {
            if ($this->containsAny($label, ['lembar'])) {
                return ['min' => 1, 'max' => 3, 'step' => 1];
            }

            return $weight
                ? $this->gramBounds($weight, 100, 250)
                : ['min' => 1, 'max' => 2.5, 'step' => 0.5];
        }

        if ($role === 'Protein') {
            if ($this->containsAny($label, ['butir'])) {
                return ['min' => 1, 'max' => 2, 'step' => 1];
            }

            if ($this->containsAny($label, ['potong'])) {
                return ['min' => 1, 'max' => 3, 'step' => 1];
            }

            return $weight
                ? $this->gramBounds($weight, 50, 150)
                : ['min' => 1, 'max' => 2, 'step' => 1];
        }

        if ($role === 'Sayur') {
            if ($this->containsAny($label, ['mangkuk'])) {
                return ['min' => 1, 'max' => 2, 'step' => 1];
            }

            return $weight
                ? $this->gramBounds($weight, 100, 200)
                : ['min' => 1, 'max' => 2, 'step' => 1];
        }

        if ($role === 'Buah') {
            if ($this->containsAny($label, ['buah'])) {
                return ['min' => 1, 'max' => 1, 'step' => 1];
            }

            return $weight
                ? $this->gramBounds($weight, 100, 150)
                : ['min' => 1, 'max' => 1, 'step' => 1];
        }

        if ($role === 'Lemak') {
            if ($this->containsAny($label, ['butir', 'potong', 'buah'])) {
                return ['min' => 1, 'max' => 2, 'step' => 1];
            }

            return $weight
                ? $this->gramBounds($weight, 25, 100, 25)
                : ['min' => 0.5, 'max' => 1, 'step' => 0.5];
        }

        return ['min' => 0.5, 'max' => 1, 'step' => 0.5];
    }

    private function gramBounds(float $baseWeight, int $minGram, int $maxGram, int $stepGram = 50): array
    {
        $min = max(0.25, $minGram / $baseWeight);
        $max = max($min, $maxGram / $baseWeight);
        $step = max(0.25, $stepGram / $baseWeight);

        return [
            'min' => round($min, 2),
            'max' => round($max, 2),
            'step' => round($step, 2),
        ];
    }

    private function servingInfo(MenuMakanan $menu): array
    {
        $unit = mb_strtolower(trim((string) ($menu->satuan ?: 'porsi')));
        $baseAmount = 1.0;
        $label = $unit;
        $weight = null;

        if (preg_match('/^(\d+(?:[.,]\d+)?)\s*(.*)$/', $unit, $matches)) {
            $baseAmount = (float) str_replace(',', '.', $matches[1]);
            $label = trim($matches[2]) ?: $unit;
        }

        if (preg_match('/\((\d+(?:[.,]\d+)?)\s*(g|gr|gram)\)/i', $unit, $matches)) {
            $weight = (float) str_replace(',', '.', $matches[1]);
        } elseif (preg_match('/\b(g|gr|gram)\b/i', $label)) {
            $weight = $baseAmount;
        }

        return [
            'label' => $label,
            'weight' => $weight,
        ];
    }

    private function nutritionForPortion(MenuMakanan $menu, float $portion): array
    {
        return [
            'kalori' => (float) $menu->kalori * $portion,
            'karbohidrat' => (float) $menu->karbohidrat * $portion,
            'protein' => (float) $menu->protein * $portion,
            'lemak' => (float) $menu->lemak * $portion,
        ];
    }

    private function candidateScore(array $candidate, array $targets): float
    {
        $menu = $candidate['menu'];
        $role = $candidate['role'];
        $nutrition = $candidate['nutrition'];
        $score = $this->diabetesSuitabilityScore($menu);

        if ($role === 'Karbo') {
            $score += $this->relativeDiff($nutrition['karbohidrat'], $targets['karbohidrat'] * 0.58) * 32;
            $score += $nutrition['protein'] * 0.35;
            $score += $nutrition['lemak'] * 2.2;
        } elseif ($role === 'Protein') {
            $score += $this->relativeDiff($nutrition['protein'], $targets['protein'] * 0.58) * 34;
            $score += $this->overTargetPenalty($nutrition['protein'], $targets['protein'], 0.72) * 120;
            $score -= min($nutrition['lemak'], $targets['lemak'] * 0.35) * 0.7;
        } elseif ($role === 'Sayur') {
            $score -= 8;
            $score += $nutrition['kalori'] * 0.05;
        } elseif ($role === 'Buah') {
            $score += $this->relativeDiff($nutrition['kalori'], $targets['kalori'] * 0.10) * 12;
            $score += $nutrition['protein'] * 0.6;
        } elseif ($role === 'Lemak') {
            $score += $this->relativeDiff($nutrition['lemak'], $targets['lemak'] * 0.22) * 30;
            $score += $this->overTargetPenalty($nutrition['protein'], $targets['protein'], 0.35) * 130;
            $score -= min($nutrition['lemak'], $targets['lemak'] * 0.35) * 1.4;
        }

        return $score;
    }

    private function collectMealCombinations(array $sets, int $index, array $current, array $targets, array &$results): void
    {
        if ($index >= count($sets)) {
            $items = array_values(array_filter($current));

            if ($items === []) {
                return;
            }

            $ids = array_map(fn (array $item) => $item['menu']->id, $items);

            if (count($ids) !== count(array_unique($ids))) {
                return;
            }

            $score = $this->combinationScore($items, $targets);
            $results[] = [
                'score' => $score,
                'items' => $items,
                'nutrition' => $this->sumNutrition($items),
            ];

            return;
        }

        foreach ($sets[$index] as $candidate) {
            $next = $current;

            if ($candidate !== null) {
                $next[] = $candidate;
            }

            $this->collectMealCombinations($sets, $index + 1, $next, $targets, $results);
        }
    }

    private function combinationScore(array $items, array $targets): float
    {
        $nutrition = $this->sumNutrition($items);
        $score = 0.0;

        $score += $this->macroBalanceScore($nutrition['kalori'], $targets['kalori'], self::DAILY_TOLERANCES['kalori'], 120);
        $score += $this->macroBalanceScore($nutrition['karbohidrat'], $targets['karbohidrat'], self::DAILY_TOLERANCES['karbohidrat'], 100, 1.15, 1.15);
        $score += $this->macroBalanceScore($nutrition['protein'], $targets['protein'], self::DAILY_TOLERANCES['protein'], 115, 1.0, 1.85);
        $score += $this->macroBalanceScore($nutrition['lemak'], $targets['lemak'], self::DAILY_TOLERANCES['lemak'], 115, 2.0, 1.25);

        foreach ($items as $item) {
            $score += $this->diabetesSuitabilityScore($item['menu']);
        }

        return $score;
    }

    private function searchBestDay(
        array $mealCandidates,
        array $mealTimes,
        int $index,
        array $current,
        array $targets,
        ?array &$best
    ): void {
        if ($index >= count($mealTimes)) {
            if ($current === []) {
                return;
            }

            $score = $this->dailyCombinationScore($current, $targets);

            if (! $best || $score < $best['score']) {
                $best = [
                    'score' => $score,
                    'items' => $current,
                ];
            }

            return;
        }

        $mealTime = $mealTimes[$index];

        foreach ($mealCandidates[$mealTime] as $candidate) {
            $next = $current;

            foreach ($candidate['items'] as $item) {
                $next[] = $item + ['waktu_makan' => $mealTime];
            }

            $this->searchBestDay($mealCandidates, $mealTimes, $index + 1, $next, $targets, $best);
        }
    }

    private function dailyCombinationScore(array $items, array $targets): float
    {
        $nutrition = $this->sumNutrition($items);
        $score = 0.0;

        $score += $this->macroBalanceScore($nutrition['kalori'], $targets['kalori'], self::DAILY_TOLERANCES['kalori'], 280);
        $score += $this->macroBalanceScore($nutrition['karbohidrat'], $targets['karbohidrat'], self::DAILY_TOLERANCES['karbohidrat'], 230, 1.25, 1.25);
        $score += $this->macroBalanceScore($nutrition['protein'], $targets['protein'], self::DAILY_TOLERANCES['protein'], 260, 1.0, 2.4);
        $score += $this->macroBalanceScore($nutrition['lemak'], $targets['lemak'], self::DAILY_TOLERANCES['lemak'], 260, 2.6, 1.35);

        foreach ($this->duplicateMenuCounts($items) as $extraUses) {
            $score += $extraUses * 70;
        }

        foreach ($items as $item) {
            $score += $this->diabetesSuitabilityScore($item['menu']) * 0.4;
        }

        return $score;
    }

    private function rebalanceItems(array $items, array $targets): array
    {
        $best = array_values($items);
        $bestScore = $this->dailyCombinationScore($best, $targets);

        for ($iteration = 0; $iteration < 48; $iteration++) {
            $improved = false;
            $nextBest = $best;
            $nextScore = $bestScore;

            foreach ($best as $index => $item) {
                $bounds = $this->portionBounds($item['menu'], $item['role']);

                foreach ([-$bounds['step'], $bounds['step']] as $delta) {
                    $portion = round($item['portion'] + $delta, 2);

                    if ($portion < $bounds['min'] - 0.0001 || $portion > $bounds['max'] + 0.0001) {
                        continue;
                    }

                    $candidate = $best;
                    $candidate[$index] = $item;
                    $candidate[$index]['portion'] = $portion;
                    $candidate[$index]['nutrition'] = $this->nutritionForPortion($item['menu'], $portion);
                    $score = $this->dailyCombinationScore($candidate, $targets);

                    if ($score + 0.0001 < $nextScore) {
                        $nextScore = $score;
                        $nextBest = $candidate;
                        $improved = true;
                    }
                }
            }

            if (! $improved) {
                break;
            }

            $best = $nextBest;
            $bestScore = $nextScore;
        }

        return $best;
    }

    private function macroBalanceScore(
        float $value,
        float $target,
        float $tolerance,
        float $weight,
        float $underWeight = 1.0,
        float $overWeight = 1.0
    ): float {
        if ($target <= 0) {
            return 0.0;
        }

        $ratio = $value / $target;
        $diff = abs($ratio - 1);
        $directionWeight = $value < $target ? $underWeight : $overWeight;
        $insideTolerance = min($diff, $tolerance) * $weight * 0.35;
        $outsideTolerance = max(0, $diff - $tolerance) * $weight * 4.8 * $directionWeight;

        return $insideTolerance + $outsideTolerance;
    }

    private function duplicateMenuCounts(array $items): array
    {
        $counts = [];

        foreach ($items as $item) {
            $id = $item['menu']->id;
            $counts[$id] = ($counts[$id] ?? 0) + 1;
        }

        return array_filter(
            array_map(fn (int $count) => max(0, $count - 1), $counts),
            fn (int $extraUses) => $extraUses > 0
        );
    }

    private function sumNutrition(array $items): array
    {
        return array_reduce($items, function (array $total, array $item) {
            foreach (['kalori', 'karbohidrat', 'protein', 'lemak'] as $key) {
                $total[$key] += $item['nutrition'][$key];
            }

            return $total;
        }, [
            'kalori' => 0.0,
            'karbohidrat' => 0.0,
            'protein' => 0.0,
            'lemak' => 0.0,
        ]);
    }

    private function diabetesFriendlyMenus(): Collection
    {
        $menus = MenuMakanan::all();
        $filteredMenus = $menus->reject(fn (MenuMakanan $menu) => $this->isHighSugarMenu($menu));

        return $filteredMenus->isNotEmpty() ? $filteredMenus->values() : $menus;
    }

    private function diabetesSuitabilityScore(MenuMakanan $menu): float
    {
        $name = mb_strtolower($menu->nama);
        $score = 0.0;

        foreach (['rebus', 'kukus', 'panggang', 'sayur', 'tahu', 'tempe', 'ikan', 'ayam', 'telur', 'gandum', 'oat', 'oatmeal', 'beras merah', 'nasi merah', 'kentang', 'ubi', 'jagung', 'brokoli', 'bayam'] as $keyword) {
            if (str_contains($name, $keyword)) {
                $score -= 2.0;
            }
        }

        if (str_contains($name, 'nasi putih')) {
            $score += 8.0;
        }

        if (str_contains($name, 'goreng')) {
            $score += 8.0;
        }

        return $score;
    }

    private function isHighSugarMenu(MenuMakanan $menu): bool
    {
        $name = mb_strtolower($menu->nama);

        foreach ([
            'gula',
            'manis',
            'sirup',
            'soda',
            'donat',
            'kue',
            'permen',
            'cokelat',
            'es krim',
            'biskuit',
            'wafer',
            'nasi putih',
            'pisang',
        ] as $keyword) {
            if (str_contains($name, $keyword)) {
                return true;
            }
        }

        return false;
    }

    private function relativeDiff(float $value, float $target): float
    {
        if ($target <= 0) {
            return 0;
        }

        return abs($value - $target) / $target;
    }

    private function underTargetPenalty(float $value, float $target, float $minimumRatio): float
    {
        if ($target <= 0 || $value >= ($target * $minimumRatio)) {
            return 0;
        }

        return (($target * $minimumRatio) - $value) / $target;
    }

    private function overTargetPenalty(float $value, float $target, float $maximumRatio): float
    {
        if ($target <= 0 || $value <= ($target * $maximumRatio)) {
            return 0;
        }

        return ($value - ($target * $maximumRatio)) / $target;
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
