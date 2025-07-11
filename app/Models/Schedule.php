<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $table = 'schedule'; // Explicitly set table name
    
    protected $fillable = [
        'name',
        'inventory_id',
        'start_time',
        'end_time',
        'purpose',
        'status',
    ];

    protected $attributes = [
        'status' => 'Scheduled',
    ];

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }
}