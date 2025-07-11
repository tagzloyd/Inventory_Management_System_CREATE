<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories'; // Change from 'category' to 'categories'
    
    protected $fillable = ['name'];

    public function inventories()
    {
        return $this->belongsToMany(Inventory::class, 'inventory_category');
    }
}