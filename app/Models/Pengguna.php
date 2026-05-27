<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengguna extends Model
{
    use SoftDeletes, HasFactory;

    protected $table = 'pengguna';
    protected $fillable = [
        'user_id',
        'jenis_kelamin',
        'tanggal_lahir',
        'tinggi_cm',
        'berat_kg',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rekamGizi() {
        return $this->hasMany(RekamGizi::class)->orderBy('tanggal', 'desc');
    }

    public function rekamGiziTerbaru() {
        return $this->hasOne(RekamGizi::class)->orderBy('tanggal', 'desc');
    }

    public function menuRekomendasi() {
        return $this->hasMany(MenuRekomendasi::class);
    }
}
