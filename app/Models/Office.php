<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $table = 'offices';
    
    protected $fillable = ['office_name'];

    public function faculty()
    {
        return $this->hasMany(Faculty::class);
    }

    public function inventories()
    {
        return $this->hasManyThrough(
            Inventory::class,
            Faculty::class,
            'office_id',
            'faculty_id'
        );
    }
}