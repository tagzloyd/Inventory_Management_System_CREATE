<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\RecordsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\CalibrationController;
use App\Http\Controllers\ConsumableController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('categories', [CategoriesController::class, 'index'])->name('inventory.categories');
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::get('records', [RecordsController::class, 'index'])->name('inventory.records');
    Route::get('faculty', [FacultyController::class, 'index'])->name('faculty.index');
    Route::get('schedule', [SchedulesController::class, 'index'])->name('schedule.index');
    Route::get('maintenance', [MaintenanceController::class, 'index'])->name('maintenance.index');
    Route::get('calibration', [CalibrationController::class, 'index'])->name('calibration.index');
    Route::get('consumable', [ConsumableController::class, 'index'])->name('consumable.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
