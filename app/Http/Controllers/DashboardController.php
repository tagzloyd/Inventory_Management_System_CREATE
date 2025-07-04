<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Office;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // For Inertia, you can pass summary data directly
        $totalCategories = Categories::count();
        $totalOffices = Office::count();
        $totalEquipment = Inventory::count();

        $mostPopulatedCategory = Categories::withCount('inventories')
            ->orderByDesc('inventories_count')
            ->first();

        $recentEquipment = Inventory::with(['category', 'office'])
            ->orderByDesc('date_acquired')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'totalCategories' => $totalCategories,
            'totalOffices' => $totalOffices,
            'totalEquipment' => $totalEquipment,
            'mostPopulatedCategory' => $mostPopulatedCategory,
            'recentEquipment' => $recentEquipment,
        ]);
    }

    // Optional: API endpoint for dashboard stats (for AJAX)
    public function stats()
    {
        $totalCategories = Categories::count();
        $totalOffices = Office::count();
        $totalEquipment = Inventory::count();

        $mostPopulatedCategory = Categories::withCount('inventories')
            ->orderByDesc('inventories_count')
            ->first();

        $recentEquipment = Inventory::with(['category', 'office'])
            ->orderByDesc('date_acquired')
            ->take(5)
            ->get();

        return response()->json([
            'totalCategories' => $totalCategories,
            'totalOffices' => $totalOffices,
            'totalEquipment' => $totalEquipment,
            'mostPopulatedCategory' => $mostPopulatedCategory,
            'recentEquipment' => $recentEquipment,
        ]);
    }
}
