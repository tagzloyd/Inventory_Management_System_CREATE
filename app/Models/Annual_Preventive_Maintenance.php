<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Annual_Preventive_Maintenance extends Model
{
    protected $table = 'annual_preventive_maintenance';

    protected $fillable = [
        'daily',
        'weekly',
        'monthly',
        'quarterly',
        'semi_annually',
        'annually',
    ];

}
