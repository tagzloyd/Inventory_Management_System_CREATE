<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Faculty;

class FacultyController extends Controller
{
    public function index()
    {
        return Inertia::render('faculty/index');
    }

    public function fetchFaculty()
    {
        return Faculty::with(['office', 'inventory'])->get();
    }
    public function getFacultyInventory($id)
    {
        $inventory = Inventory::where('faculty_id', $id)
            ->with(['categories', 'office'])
            ->get();
        return response()->json($inventory);
    }
    public function store(Request $request)
        {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'office_id' => 'required|exists:offices,id',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
            ]);

            $faculty = Faculty::create($validated);

            return response()->json($faculty, 201);
        }


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'office_id' => 'required|exists:offices,id',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $faculty = Faculty::findOrFail($id);
        $faculty->update($validated);
        return response()->json($faculty);
    }

    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();
        return response()->noContent();
    }

    public function show($id)
    {
        $faculty = Faculty::with(['office', 'inventory'])->findOrFail($id);
        return response()->json($faculty);
    }
}
