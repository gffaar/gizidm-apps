<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RekamGizi extends Model
{
    use SoftDeletes;

    protected $table = 'rekam_gizi';
    protected $fillable = [
        'pengguna_id',
        'nama',
        'usia',
        'tinggi_badan',
        'berat_badan',
        'jenis_kelamin',
        'riwayat_diabetes',
        'imt',
        'status_gizi',
        'bmr',
        'tee',
        'kalori_total',
        'karbohidrat',
        'protein',
        'lemak',
        'kadar_gula_darah',
        'tanggal',
    ];

    public function pengguna() {
        return $this->belongsTo(Pengguna::class);
    }
}
