<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuRekomendasi extends Model
{
    use SoftDeletes;

    protected $table = 'menu_rekomendasi';
    protected $fillable = [
        'pengguna_id',
        'menu_makanan_id',
        'jumlah',
        'waktu_makan',
    ];

    public function pengguna() {
        return $this->belongsTo(Pengguna::class);
    }

    public function menuMakanan() {
        return $this->belongsTo(MenuMakanan::class);
    }
}
