<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Planned extends Model
{
    use HasFactory;
    /**
     * The table associated with the model.
     */
    protected $table = 'planned';
    protected $fillable = [
        'cal_id',
        'jan', 'feb', 'mar', 'apr', 'may', 'jun',
        'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    ];
    public function calibration(): BelongsTo
    {
        return $this->belongsTo(Calibration::class, 'cal_id');
    }
}
