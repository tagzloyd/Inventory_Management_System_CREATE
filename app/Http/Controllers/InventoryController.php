<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Models\Categories; // Ensure this is the correct model for categories
use Inertia\Inertia;
use App\Models\Faculty; // Ensure this is the correct model for faculties

class InventoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Index', []); 
    }
    public function fetchInventory()
    {
        return Inventory::with(['categories', 'office', 'faculty'])->get();
    }

     public function fetchFaculties()
    {
        return Faculty::all(['id', 'name']);
    }
        public function store(Request $request)
        {
            $validated = $request->validate([
                'office_id' => 'required|exists:offices,id',
                'equipment_name' => 'required|string|max:255',
                'faculty_id' => 'required|exists:faculty,id',
                'serial_number' => 'nullable|string|max:255',
                'date_acquired' => 'nullable|string|max:255',
                'notes' => 'nullable|string|max:1000',
                'remarks' => 'nullable|string|max:1000',
                'category_ids' => 'array',
                'category_ids.*' => 'exists:categories,id',
            ]);

            $inventory = Inventory::create($validated);
            if (isset($validated['category_ids'])) {
                $inventory->categories()->sync($validated['category_ids']);
            }

            return response()->json($inventory);
        }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'office_id' => 'required|exists:offices,id',
            'equipment_name' => 'required|string|max:255',
            'faculty_id' => 'required|exists:faculty,id',
            'serial_number' => 'nullable|string|max:255|',
            'date_acquired' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'remarks' => 'nullable|string|max:1000',
            'category_ids' => 'array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $inventory = Inventory::findOrFail($id);
        $inventory->update($validated);
        
        // Sync categories if provided
        if (isset($validated['category_ids'])) {
            $inventory->categories()->sync($validated['category_ids']);
        }

        return response()->json($inventory->load('categories', 'office', 'faculty'));
    }
    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            $inventory = Inventory::findOrFail($id);
            $inventory->categories()->detach();
            $inventory->delete();
        });

        return response()->noContent();
    }
    public function show($id)
    {
        $inventory = Inventory::findOrFail($id);
        return response()->json($inventory);
    }
}