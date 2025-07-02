<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Shipping', []); 
    }
}
