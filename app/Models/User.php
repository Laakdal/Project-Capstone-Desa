<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'nik',
        'phone',
        'jabatan',
        'divisi',
        'role',
        'status',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'permissions' => 'array',
        ];
    }

    /**
     * Get all letters created by this user
     */
    public function letters()
    {
        return $this->hasMany(Letter::class, 'user_id');
    }

    /**
     * Check if user is Sekdes
     */
    public function isSekdes(): bool
    {
        $role = strtoupper($this->role ?? '');
        $jabatan = strtoupper($this->jabatan ?? '');
        return $role === 'SEKDES' || $jabatan === 'SEKDES' || 
               $this->role === 'Sekretaris Desa' || $this->jabatan === 'Sekretaris Desa';
    }

    /**
     * Check if user is Kades
     */
    public function isKades(): bool
    {
        $role = strtoupper($this->role ?? '');
        $jabatan = strtoupper($this->jabatan ?? '');
        return $role === 'KADES' || $jabatan === 'KADES' || 
               $this->role === 'Kepala Desa' || $this->jabatan === 'Kepala Desa';
    }

    /**
     * Check if user is Pegawai
     */
    public function isPegawai(): bool
    {
        $role = strtoupper($this->role ?? '');
        $jabatan = strtoupper($this->jabatan ?? '');
        return $role === 'PEGAWAI' || $jabatan === 'PEGAWAI' || 
               $this->role === 'Pegawai Desa' || $this->jabatan === 'Pegawai Desa';
    }
}
