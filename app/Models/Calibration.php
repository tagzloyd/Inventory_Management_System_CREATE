<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Calibration extends Model
{
    use HasFactory;
    /**
     * The table associated with the model.
     */
    protected $table = 'calibration';

    protected $fillable = [
        'instrument_name_or_eq_code',
        'issued_to',
        'freq_of_cal',
    ];

    public function planned()
    {
        return $this->hasOne(Planned::class, 'cal_id');
    }

    public function actual()
    {
        return $this->hasOne(Actual::class, 'cal_id');
    }

    public function remarks()
    {
        return $this->hasOne(Remarks::class, 'cal_id');
    }
}