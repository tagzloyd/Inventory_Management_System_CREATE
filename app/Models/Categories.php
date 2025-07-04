<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'category_name',
    ];
    public function inventories()
    {
        return $this->hasMany(\App\Models\Inventory::class, 'category_id');
    }

}
