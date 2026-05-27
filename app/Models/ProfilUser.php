<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilUser extends Model
{
    use HasFactory;

    protected $table = 'profil_user';

    protected $fillable = [
        'user_id',
        'umur',
        'tanggal_lahir',
        'jenis_kelamin',
        'berat_kg',
        'tinggi_cm',
        'bmi',
        'kadar_gula_darah',
        'riwayat_diabetes',
        'aktivitas_fisik',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
