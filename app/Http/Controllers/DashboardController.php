<?php

namespace App\Http\Controllers;

use App\Models\Category;
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
        $totalCategory = Category::count();
        $totalOffices = Office::count();
        $totalEquipment = Inventory::count();

        // Equipment status counts
        $functionalCount = Inventory::where('remarks', 'Functional')->count();
        $nonFunctionalCount = Inventory::where('remarks', 'Non-Functional')->count();
        $underRepairCount = Inventory::where('remarks', 'Under Repair')->count();
        $defectiveCount = Inventory::where('remarks', 'Defective')->count();

        // Equipment by office
        $equipmentByOffice = Inventory::with('office')
            ->selectRaw('office_id, count(*) as count')
            ->groupBy('office_id')
            ->get()
            ->mapWithKeys(function ($item) {
                $officeName = $item->office ? $item->office->office_name : 'No Office';
                return [$officeName => $item->count];
            });

        // Status by office
        $statusByOffice = Inventory::with('office')
            ->selectRaw('office_id, remarks, count(*) as count')
            ->groupBy('office_id', 'remarks')
            ->get()
            ->groupBy(function ($item) {
                return $item->office ? $item->office->office_name : 'No Office';
            })
            ->map(function ($officeItems) {
                return $officeItems->mapWithKeys(function ($item) {
                    return [$item->remarks => $item->count];
                });
            });

        // Category distribution
        $categoryDistribution = Category::withCount('inventories')
            ->orderByDesc('inventories_count')
            ->get()
            ->map(function ($category) use ($totalEquipment) {
                return [
                    'name' => $category->name,
                    'count' => $category->inventories_count,
                    'percentage' => $totalEquipment > 0 ? round(($category->inventories_count / $totalEquipment) * 100) : 0
                ];
            });

        // Recent equipment
        $recentEquipment = Inventory::with(['categories', 'office'])
            ->orderByDesc('date_acquired')
            ->take(5)
            ->get();

        // Equipment status summary
        $equipmentStatusSummary = [
            'Functional' => $functionalCount,
            'Non-Functional' => $nonFunctionalCount,
            'Under Repair' => $underRepairCount,
            'Defective' => $defectiveCount,
        ];

        return Inertia::render('Dashboard', [
            'totalCategory' => $totalCategory,
            'totalOffices' => $totalOffices,
            'totalEquipment' => $totalEquipment,
            'functionalCount' => $functionalCount,
            'nonFunctionalCount' => $nonFunctionalCount,
            'underRepairCount' => $underRepairCount,
            'defectiveCount' => $defectiveCount,
            'equipmentStatusSummary' => $equipmentStatusSummary,
            'statusByOffice' => $statusByOffice,
            'categoryDistribution' => $categoryDistribution,
            'recentEquipment' => $recentEquipment,
        ]);
    }
}