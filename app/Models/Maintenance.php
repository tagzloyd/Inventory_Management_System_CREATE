<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    protected $table = 'maintenance';

    protected $fillable = [
        'inventory_id',
        'number_of_available_units',
        'update_unit',
        'remarks',
        'maintenance_schedule',
        'activities',
    ];

}
