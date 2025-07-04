<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function index()
    {
        return inertia('Inventory/Categories', [
            'categories' => Categories::all()
        ]);
    }

    public function fetchCategories()
    {
        return Categories::withCount('inventories')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
        ]);
        $category = Categories::create([
            'category_name' => $validated['category_name']
        ]);

        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255',
        ]);
        $category = Categories::findOrFail($id);
        $category->update([
            'category_name' => $validated['category_name']
        ]);

        return response()->json($category);
    }
    
    public function destroy($id)
    {
        $category = Categories::findOrFail($id);
        $category->delete();

        return response()->noContent();
    }
}
