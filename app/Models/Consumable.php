<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consumable extends Model
{
    protected $table = 'consumables';

    protected $fillable = [
        'item_name',
        'description',
        'quantity'
    ];
}
