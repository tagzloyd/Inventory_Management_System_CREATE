<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Annual_Preventive_Maintenance;

class MaintenanceController extends Controller
{
    public function index()
    {
        $maintenanceItems = Annual_Preventive_Maintenance::all();
        return Inertia::render('maintenance/index', [
            'maintenanceItems' => $maintenanceItems,
        ]);
    }

    public function fetch()
    {
        return Annual_Preventive_Maintenance::all();
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'daily' => 'nullable|string|max:555',
                'weekly' => 'nullable|string|max:555',
                'monthly' => 'nullable|string|max:555',
                'quarterly' => 'nullable|string|max:555',
                'semi_annually' => 'nullable|string|max:555',
                'annually' => 'nullable|string|max:555',
            ]);

            $maintenance = Annual_Preventive_Maintenance::create($validated);

            return response()->json([
                'success' => true,
                'data' => $maintenance
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
            $maintenance = Annual_Preventive_Maintenance::findOrFail($id);

            $validated = $request->validate([
                'daily' => 'nullable|string|max:555',
                'weekly' => 'nullable|string|max:555',
                'monthly' => 'nullable|string|max:555',
                'quarterly' => 'nullable|string|max:555',
                'semi_annually' => 'nullable|string|max:555',
                'annually' => 'nullable|string|max:555',
            ]);

            $maintenance->update($validated);

            return $maintenance;
    }
    public function destroy($id){
        
        $maintenance =  Annual_Preventive_Maintenance::findOrFail($id);

        $maintenance -> delete();

        return $maintenance;
    }
}