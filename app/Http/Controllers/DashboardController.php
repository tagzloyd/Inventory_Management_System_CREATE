<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Office;
use App\Models\Inventory;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalCategories = Categories::count();
        $totalOffices = Office::count();
        $totalEquipment = Inventory::count();

        // Functional vs Non-Functional
        $functionalCount = Inventory::where('remarks', '!=', 'Non-Functionable')->count();
        $nonFunctionalCount = Inventory::where('remarks', 'Non-Functionable')->count();

        // Equipment by office
        $equipmentByOffice = Inventory::with('office')
            ->selectRaw('office_id, count(*) as count')
            ->groupBy('office_id')
            ->get()
            ->mapWithKeys(function ($item) {
                $officeName = $item->office ? $item->office->office_name : 'No Office';
                return [$officeName => $item->count];
            });

        // Functional by office
        $functionalByOffice = Inventory::with('office')
            ->where('remarks', '!=', 'Non-Functionable')
            ->selectRaw('office_id, count(*) as count')
            ->groupBy('office_id')
            ->get()
            ->mapWithKeys(function ($item) {
                $officeName = $item->office ? $item->office->office_name : 'No Office';
                return [$officeName => $item->count];
            });

        // Non-functional by office
        $nonFunctionalByOffice = Inventory::with('office')
            ->where('remarks', 'Non-Functionable')
            ->selectRaw('office_id, count(*) as count')
            ->groupBy('office_id')
            ->get()
            ->mapWithKeys(function ($item) {
                $officeName = $item->office ? $item->office->office_name : 'No Office';
                return [$officeName => $item->count];
            });

        // Category distribution
        $categoryDistribution = Categories::withCount('inventories')
            ->orderByDesc('inventories_count')
            ->get()
            ->map(function ($category) use ($totalEquipment) {
                return [
                    'name' => $category->category_name,
                    'count' => $category->inventories_count,
                    'percentage' => $totalEquipment > 0 ? round(($category->inventories_count / $totalEquipment) * 100) : 0
                ];
            });

        // Recent equipment
        $recentEquipment = Inventory::with(['category', 'office'])
            ->orderByDesc('date_acquired')
            ->take(5)
            ->get();

        // Warranty expiring soon (within 90 days)
        $expiringWarrantyItems = Inventory::whereNotNull('warranty_expiry')
            ->where('warranty_expiry', '>', now())
            ->where('warranty_expiry', '<=', now()->addDays(90))
            ->orderBy('warranty_expiry')
            ->get();

        // Maintenance items
        $maintenanceItems = Maintenance::with('inventory')
            ->orderBy('next_maintenance_date')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'inventory_id' => $item->inventory_id,
                    'equipment_name' => $item->inventory->equipment_name,
                    'maintenance_date' => $item->maintenance_date,
                    'next_maintenance_date' => $item->next_maintenance_date,
                    'status' => $item->status,
                    'is_overdue' => $item->status !== 'completed' && 
                                    Carbon::parse($item->next_maintenance_date)->lt(now())
                ];
            });

        // Overdue maintenance
        $overdueMaintenance = $maintenanceItems->where('is_overdue', true);

        return Inertia::render('Dashboard', [
            'totalCategories' => $totalCategories,
            'totalOffices' => $totalOffices,
            'totalEquipment' => $totalEquipment,
            'functionalCount' => $functionalCount,
            'nonFunctionalCount' => $nonFunctionalCount,
            'functionalByOffice' => $functionalByOffice,
            'nonFunctionalByOffice' => $nonFunctionalByOffice,
            'categoryDistribution' => $categoryDistribution,
            'recentEquipment' => $recentEquipment,
            'expiringWarrantyItems' => $expiringWarrantyItems,
            'maintenanceItems' => $maintenanceItems,
            'overdueMaintenance' => $overdueMaintenance,
        ]);
    }
}