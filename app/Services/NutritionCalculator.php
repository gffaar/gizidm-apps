<?php

namespace App\Services;

class NutritionCalculator
{
    public function calculate(array $data): array
    {
        $weight = (float) $data['berat_kg'];
        $height = (float) $data['tinggi_cm'];
        $age = (float) $data['usia'];
        $heightMeter = $height / 100;
        $imt = $weight / ($heightMeter * $heightMeter);
        $statusGizi = $this->statusGizi($imt);
        $bmr = $this->bmr($weight, $height, $age, $data['jenis_kelamin']);
        $energy = (int) round($bmr * $this->activityFactor($data['aktivitas']));

        return [
            'imt' => round($imt, 1),
            'status_gizi' => $statusGizi,
            'bmr' => (int) round($bmr),
            'tee' => $energy,
            'kalori_total' => $energy,
            'energi' => $energy,
            'karbohidrat' => round((0.55 * $energy) / 4, 1),
            'protein' => round((0.15 * $energy) / 4, 1),
            'lemak' => round((0.30 * $energy) / 9, 1),
            'serat' => round(($energy * 14) / 1000, 1),
            'cairan' => (int) round($weight * 30),
        ];
    }

    private function statusGizi(float $imt): string
    {
        if ($imt < 18.5) {
            return 'Kurus';
        }

        if ($imt < 23) {
            return 'Normal';
        }

        if ($imt < 25) {
            return 'Overweight';
        }

        if ($imt < 30) {
            return 'Obesitas I';
        }

        return 'Obesitas II';
    }

    private function bmr(float $weight, float $height, float $age, string $gender): float
    {
        if ($gender === 'Laki-laki') {
            return 66 + (13.7 * $weight) + (5 * $height) - (6.8 * $age);
        }

        return 655 + (9.6 * $weight) + (1.8 * $height) - (4.7 * $age);
    }

    private function activityFactor(string $activity): float
    {
        return [
            'Sangat Ringan' => 1.2,
            'Ringan' => 1.375,
            'Sedang' => 1.55,
            'Berat' => 1.725,
        ][$activity];
    }
}
