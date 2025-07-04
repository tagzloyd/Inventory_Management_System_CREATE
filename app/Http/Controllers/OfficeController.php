<?php

namespace App\Http\Controllers;
use App\Models\Office;

use Illuminate\Http\Request;

class OfficeController extends Controller
{
    public function index()
    {
        return inertia('Inventory/Office', [
            'offices' => Office::all()
        ]);
    }

    public function fetchOffices()
    {
        return Office::withCount('inventories')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'office_name' => 'required|string|max:255',
        ]);
        $office = Office::create([
            'office_name' => $validated['office_name']
        ]);

        return response()->json($office);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'office_name' => 'required|string|max:255',
        ]);
        $office = Office::findOrFail($id);
        $office->update([
            'office_name' => $validated['office_name']
        ]);

        return response()->json($office);
    }

    public function destroy($id)
    {
        $office = Office::findOrFail($id);
        $office->delete();

        return response()->noContent();
    }
    public function show($id)
    {
        $office = Office::with('inventories')->findOrFail($id);
        return response()->json($office);
    }
}
