<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Categories', [
            'category' => Category::withCount('inventories')->get()
        ]);
    }

    public function fetchCategories()
    {
        return Category::withCount('inventories')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category = Category::create($validated);

        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$id,
        ]);

        $category = Category::findOrFail($id);
        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Detach all inventory relationships before deleting
        $category->inventories()->detach();
        $category->delete();

        return response()->noContent();
    }
}