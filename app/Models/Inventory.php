<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'inventory';
    
    protected $fillable = [
        'equipment_name',
        'category_id',
        'faculty_id',
        'office_id',
        'serial_number',
        'date_acquired',
        'notes',
        'remarks',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'inventory_category');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

}