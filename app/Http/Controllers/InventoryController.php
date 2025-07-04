<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Models\Categories; // Ensure this is the correct model for categories
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Index', []); 
    }
    public function fetchInventory()
    {
        return Inventory::with(['category', 'office'])->get();
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'office_id' => 'required|exists:office,id',
            'equipment_name' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'date_acquired' => 'required|date',
            'notes' => 'nullable|string|max:1000',
            'remarks' => 'nullable|string|max:1000', // Assuming you want to allow remarks
        ]);

        $inventory = Inventory::create($validated);

        return response()->json($inventory);
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'office_id' => 'required|exists:office,id', // Ensure office_id is validated
            // 'office_id' is required to associate the inventory with an office
            'equipment_name' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'date_acquired' => 'required|date',
            'notes' => 'nullable|string|max:1000',
            'remarks' => 'nullable|string|max:1000', // Assuming you want to allow remarks
        ]);
        $inventory = Inventory::findOrFail($id);
        $inventory->update($validated);

        return response()->json($inventory);
    }
    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();

        return response()->noContent();
    }
    public function show($id)
    {
        $inventory = Inventory::findOrFail($id);
        return response()->json($inventory);
    }
}