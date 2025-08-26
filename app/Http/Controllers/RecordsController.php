<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class RecordsController extends Controller
{
    public function index()
    {
        return Inertia::render('record/index', []);
    }

    public function fetch()
    {
        try {
            // First get all inventory items
            $inventoryItems = DB::table('inventory')
                ->leftJoin('offices', 'inventory.office_id', '=', 'offices.id')
                ->leftJoin('faculty', 'inventory.faculty_id', '=', 'faculty.id')
                ->select(
                    'inventory.id',
                    'inventory.equipment_name',
                    'inventory.serial_number',
                    'inventory.date_acquired',
                    'inventory.notes',
                    'inventory.remarks',
                    'inventory.maintenance_schedule',
                    'inventory.maintenance_activities',
                    'offices.office_name',
                    'faculty.name as faculty_name'
                )
                ->get();

            // Get all categories for each inventory item
            $categories = DB::table('inventory_category')
                ->join('categories', 'inventory_category.category_id', '=', 'categories.id')
                ->select('inventory_category.inventory_id', 'categories.name')
                ->get()
                ->groupBy('inventory_id');

            // Combine categories with inventory items
            $records = $inventoryItems->map(function ($item) use ($categories) {
                $itemCategories = isset($categories[$item->id]) ? $categories[$item->id]->pluck('name')->implode(', ') : '';
                $item->category = $itemCategories;
                return $item;
            });

            // Grouped Inventory
            $grouped = DB::table('inventory')
                ->select(
                    'equipment_name',
                    DB::raw('COUNT(*) as number_of_units'),
                    'maintenance_activities',
                    'maintenance_schedule'
                )
                ->groupBy('equipment_name', 'maintenance_activities', 'maintenance_schedule')
                ->get();

            return response()->json([
                'success' => true,
                'all_records' => $records,
                'grouped_records' => $grouped
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error fetching records: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch records',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}