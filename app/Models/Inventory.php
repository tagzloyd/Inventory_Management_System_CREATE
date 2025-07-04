<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'inventory';

    protected $fillable = [
        'category_id',
        'office_id',
        'equipment_name',
        'model',
        'serial_number',
        'date_acquired',
        'notes',
        'remarks', // Added remarks field
    ];

    public function category()
    {
        return $this->belongsTo(Categories::class); // Changed from Category::class to Categories::class
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }
}