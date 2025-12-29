<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Folder extends Model
{
    protected $fillable = [
        'name',
        'description',
        'created_by',
    ];

    /**
     * Get the user who created this folder
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all letters in this folder
     */
    public function letters(): BelongsToMany
    {
        return $this->belongsToMany(Letter::class, 'letter_folder')
            ->withTimestamps();
    }
}
