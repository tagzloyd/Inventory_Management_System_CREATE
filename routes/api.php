<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\CalibrationController;
use App\Http\Controllers\MaintenanceController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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
    Route::get('existing_equipment', 'maintenance_equipment')->name('inventory.maintenance_equipment');
});

Route::controller(OfficeController::class)->group(function () {
    Route::get('offices', 'fetchOffices')->name('offices.fetchOffices');
    Route::post('offices', 'store')->name('offices.store');
    Route::put('offices/{id}', 'update')->name('offices.update');
    Route::delete('offices/{id}', 'destroy')->name('offices.destroy');
    Route::get('offices/{id}', 'show')->name('offices.show');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::controller(FacultyController::class)->group(function () {
    Route::get('faculties', 'fetchFaculty')->name('faculties.fetchFaculty');
    Route::post('faculties/store', 'store')->name('faculties.store');
    Route::put('faculties/{id}', 'update')->name('faculties.update');
    Route::delete('faculties/{id}', 'destroy')->name('faculties.destroy');
    Route::get('faculties/{id}', 'show')->name('faculties.show');
    Route::get('/faculties/{id}/inventory','getFacultyInventory')->name('faculties.getFacultyInventory');
});

Route::controller(SchedulesController::class)->group(function () {
    Route::get('/schedules/month', 'getMonthEvents');
    Route::get('/schedules/date/{date}', 'getDateEvents');
    Route::get('/schedules/{schedule}', 'show');
    Route::post('/schedules', 'store');
    Route::put('/schedules/{schedule}', 'update');
    Route::delete('/schedules/{schedule}', 'destroy');
});

Route::controller(CalibrationController::class)->prefix('calibration')->group(function () {
    Route::get('/', 'index')->name('calibration.index');
    Route::get('/fetch', 'fetch')->name('calibration.fetch');
    Route::post('/', 'store')->name('calibration.store');
    Route::post('/planned', 'storePlanned')->name('calibration.storePlanned');
    Route::post('/actual', 'storeActual')->name('calibration.storeActual');
    Route::post('/remarks', 'storeRemarks')->name('calibration.storeRemarks');
    Route::get('/{id}', 'show')->name('calibration.show');
    Route::put('/{id}', 'update')->name('calibration.update');
    Route::delete('/{id}', 'destroy')->name('calibration.destroy');
});

Route::controller(MaintenanceController::class)->prefix('maintenance')->group(function () {
    Route::get('/', 'index')->name('maintenance.index');
    Route::get('/fetch', 'fetch')->name('maintenance.fetch');
    Route::post('/annual-preventive-maintenance', 'store')->name('maintenance.store');
    Route::put('/{id}', 'update')->name('maintenance.update');
    Route::delete('/{id}', 'destroy')->name('maintenance.destroy');
});

// Remove this duplicate route definition
// Route::resource('maintenance', MaintenanceController::class);