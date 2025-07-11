<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $table = 'faculty';

    protected $fillable = ['name', 'office_id', 'email', 'phone'];
    
    public function office()
    {
        return $this->belongsTo(Office::class);
    }
}