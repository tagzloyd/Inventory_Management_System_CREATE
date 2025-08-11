<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\RecordsController;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\SchedulesController;

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
    // Route::get('supply', [SupplyController::class, 'index'])->name('inventory.supply');
    // Route::get('shipping', [ShippingController::class, 'index'])->name('inventory.shipping');
    Route::get('faculty', [App\Http\Controllers\FacultyController::class, 'index'])->name('faculty.index');
    Route::get('schedule', [SchedulesController::class, 'index'])->name('schedule.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
