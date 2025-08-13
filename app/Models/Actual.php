<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Actual extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'actual';

    protected $fillable = [
        'cal_id',
        'jan', 'feb', 'mar', 'apr', 'may', 'jun',
        'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    ];

    public function calibration()
    {
        return $this->belongsTo(Calibration::class, 'cal_id');
    }
}
