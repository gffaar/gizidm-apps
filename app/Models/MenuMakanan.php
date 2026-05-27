<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuMakanan extends Model
{
    use SoftDeletes;

    protected $table = 'menu_makanan';
    protected $fillable = [
        'nama',
        'kategori',
        'kalori',
        'karbohidrat',
        'protein',
        'lemak',
        'satuan',
        'gambar',
    ];

    public function menuRekomendasi() {
        return $this->hasMany(MenuRekomendasi::class);
    }
}
