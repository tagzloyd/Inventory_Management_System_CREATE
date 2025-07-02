<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RecordsController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Records', []); 
    }
}
