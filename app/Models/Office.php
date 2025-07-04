<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $table = 'office';

    protected $fillable = [
        'office_name',
    ];

    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'office_id');
    }
}
