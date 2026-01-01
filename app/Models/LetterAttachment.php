<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LetterAttachment extends Model
{
    protected $fillable = [
        'letter_id',
        'filename',
        'mime_type',
        'file_content'
    ];

    /**
     * Get the letter that owns the attachment.
     */
    public function letter()
    {
        return $this->belongsTo(Letter::class);
    }
}
