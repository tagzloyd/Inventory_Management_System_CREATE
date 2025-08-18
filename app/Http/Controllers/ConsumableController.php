<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Consumable;
use Illuminate\Support\Facades\Validator;

class ConsumableController extends Controller
{
    public function index()
    {
        return Inertia::render('consumable/index');
    }

    public function fetch()
    {
        try {
            $consumables = Consumable::all();
            return response()->json($consumables);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch consumable items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'quantity' => 'required|integer|min:0',
            'status' => 'required|string|in:Available,Low Stock,Out of Stock',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $consumable = Consumable::create($validator->validated());
            return response()->json([
                'message' => 'Consumable item created successfully',
                'data' => $consumable
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create consumable item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'item_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'quantity' => 'required|integer|min:0',
            'status' => 'required|string|in:Available,Low Stock,Out of Stock',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $consumable = Consumable::findOrFail($id);
            $consumable->update($validator->validated());
            
            return response()->json([
                'message' => 'Consumable item updated successfully',
                'data' => $consumable
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update consumable item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $consumable = Consumable::findOrFail($id);
            $consumable->delete();
            
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete consumable item',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}