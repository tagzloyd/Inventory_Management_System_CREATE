<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Add the 'api' prefix to these routes
Route::controller(CategoriesController::class)->group(function () {
    Route::get('categories', 'fetchCategories')->name('categories.fetchCategories');
    Route::post('categories', 'store')->name('categories.store');
    Route::put('categories/{id}', 'update')->name('categories.update');
    Route::delete('categories/{id}', 'destroy')->name('categories.destroy');
});
Route::controller(InventoryController::class)->group(function () {
    Route::get('inventory', 'fetchInventory')->name('inventory.fetchInventory');
    Route::post('inventory', 'store')->name('inventory.store');
    Route::put('inventory/{id}', 'update')->name('inventory.update');
    Route::delete('inventory/{id}', 'destroy')->name('inventory.destroy');
    Route::get('inventory/{id}', 'show')->name('inventory.show');
});

Route::controller(OfficeController::class)->group(function () {
    Route::get('offices', 'fetchOffices')->name('offices.fetchOffices');
    Route::post('offices', 'store')->name('offices.store');
    Route::put('offices/{id}', 'update')->name('offices.update');
    Route::delete('offices/{id}', 'destroy')->name('offices.destroy');
    Route::get('offices/{id}', 'show')->name('offices.show');
});
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');