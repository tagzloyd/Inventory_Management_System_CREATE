<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class CalibrationController extends Controller
{
    public function index()
    {
        return Inertia::render('calibration/index');
    }
}
