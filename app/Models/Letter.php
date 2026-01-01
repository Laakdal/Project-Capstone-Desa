<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Letter extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'letters';
    
    /**
     * Status constants
     */
    const STATUS_DRAFT = 'draft';
    const STATUS_SENT = 'sent'; // Surat dikirim oleh Pegawai
    const STATUS_REVOKED = 'revoked'; // Dikembalikan oleh Sekretaris ke Pegawai
    const STATUS_CONTINUED = 'continued'; // Diteruskan oleh Sekretaris ke Kepala Desa
    const STATUS_REJECTED = 'rejected'; // Ditolak oleh Kepala Desa
    const STATUS_APPROVED = 'approved'; // Disetujui oleh Kepala Desa

    protected $fillable = [
        'user_id',
        'template_type',
        'letter_number',
        'subject',
        'recipient',
        'status',
        'content',
        'meta_data',
        'pdf_path',
        'secretary_notes',
        'head_notes',
        'verified_by',
        'approved_by',
        'verified_at',
        'approved_at',
    ];

    protected $casts = [
        'meta_data' => 'array',
        'verified_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function letterType(): BelongsTo
    {
        return $this->belongsTo(LetterType::class, 'tipe_surat', 'code');
    }

    /**
     * Get all folders this letter belongs to
     */
    public function folders(): BelongsToMany
    {
        return $this->belongsToMany(Folder::class, 'letter_folder')
            ->withTimestamps();
    }

    /**
     * Query Scopes for Letter Status
     */
    
    /**
     * Scope for draft letters
     */
    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    /**
     * Scope for sent letters (waiting for secretary review)
     */
    public function scopeSent($query)
    {
        return $query->where('status', self::STATUS_SENT);
    }

    /**
     * Scope for continued letters (waiting for head approval)
     */
    public function scopeContinued($query)
    {
        return $query->where('status', self::STATUS_CONTINUED);
    }

    /**
     * Scope for approved letters
     */
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope for rejected letters
     */
    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    /**
     * Scope for revoked letters
     */
    public function scopeRevoked($query)
    {
        return $query->where('status', self::STATUS_REVOKED);
    }

    /**
     * Get the attachments for the letter.
     */
    public function attachments()
    {
        return $this->hasMany(LetterAttachment::class);
    }
}
