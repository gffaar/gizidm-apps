<?php

use App\Services\NutritionCalculator;

it('calculates daily nutrition needs using Harris-Benedict for a 27 year old male', function () {
    $result = (new NutritionCalculator)->calculate([
        'berat_kg' => 56,
        'tinggi_cm' => 170,
        'usia' => 27,
        'jenis_kelamin' => 'Laki-laki',
        'aktivitas' => 'Ringan',
    ]);

    expect($result)
        ->imt->toBe(19.4)
        ->bmr->toBe(1500)
        ->kalori_total->toBe(2062)
        ->karbohidrat->toBe(283.5)
        ->protein->toBe(77.3)
        ->lemak->toBe(68.7)
        ->serat->toBe(28.9)
        ->cairan->toBe(1680);
});

it('calculates daily nutrition needs using Harris-Benedict for a 25 year old male', function () {
    $result = (new NutritionCalculator)->calculate([
        'berat_kg' => 50,
        'tinggi_cm' => 165,
        'usia' => 25,
        'jenis_kelamin' => 'Laki-laki',
        'aktivitas' => 'Ringan',
    ]);

    expect($result)
        ->imt->toBe(18.4)
        ->bmr->toBe(1406)
        ->kalori_total->toBe(1933)
        ->karbohidrat->toBe(265.8)
        ->protein->toBe(72.5)
        ->lemak->toBe(64.4)
        ->serat->toBe(27.1)
        ->cairan->toBe(1500);
});
