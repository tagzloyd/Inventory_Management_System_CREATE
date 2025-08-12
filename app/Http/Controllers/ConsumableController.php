<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsumableController extends Controller
{
    public function index()
    {
        return Inertia::render('consumable/index');
    }
}
