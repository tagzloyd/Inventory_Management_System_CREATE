<?php

namespace App\Http\Controllers;

use App\Models\Calibration;
use App\Models\CalibrationDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Planned;
use App\Models\Remarks;
use App\Models\Actual;


class CalibrationController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('calibration/index', []);
    }

    public function fetch(Request $request)
    {
        return Calibration::with(['planned', 'actual', 'remarks'])->get();
    }

    public function store(Request $request)
    {
        $calibration = $request->validate([
            'instrument_name_or_eq_code' => 'required|string|max:255',
            'issued_to' => 'nullable|string|max:255',
            'freq_of_cal' => 'nullable|string|max:255',
        ]);

        $calibration = Calibration::create($calibration);
        return response()->json($calibration, 201);
    }
    
    public function storePlanned(Request $request)
    {
        $planned = $request->validate([
            'cal_id' => 'required|exists:calibration,id',
            'jan' => 'nullable|string|max:255',
            'feb' => 'nullable|string|max:255',
            'mar' => 'nullable|string|max:255',
            'apr' => 'nullable|string|max:255',
            'may' => 'nullable|string|max:255',
            'jun' => 'nullable|string|max:255',
            'jul' => 'nullable|string|max:255',
            'aug' => 'nullable|string|max:255',
            'sep' => 'nullable|string|max:255',
            'oct' => 'nullable|string|max:255',
            'nov' => 'nullable|string|max:255',
            'dec' => 'nullable|string|max:255',
        ]);

        $planned = Planned::updateOrCreate(
            ['cal_id' => $planned['cal_id']],
            $planned
        );
        return response()->json($planned, 201);
    }
    
    public function storeActual(Request $request)
    {
        $actual = $request->validate([
            'cal_id' => 'required|exists:calibration,id',
            'jan' => 'nullable|string|max:255',
            'feb' => 'nullable|string|max:255',
            'mar' => 'nullable|string|max:255',
            'apr' => 'nullable|string|max:255',
            'may' => 'nullable|string|max:255',
            'jun' => 'nullable|string|max:255',
            'jul' => 'nullable|string|max:255',
            'aug' => 'nullable|string|max:255',
            'sep' => 'nullable|string|max:255',
            'oct' => 'nullable|string|max:255',
            'nov' => 'nullable|string|max:255',
            'dec' => 'nullable|string|max:255',
        ]);

        $actual = Actual::updateOrCreate(
            ['cal_id' => $actual['cal_id']],
            $actual
        );
        return response()->json($actual, 201);
    }
    
    public function storeRemarks(Request $request)
    {
        $remarks = $request->validate([
            'cal_id' => 'required|exists:calibration,id',
            'jan' => 'nullable|string|max:255',
            'feb' => 'nullable|string|max:255',
            'mar' => 'nullable|string|max:255',
            'apr' => 'nullable|string|max:255',
            'may' => 'nullable|string|max:255',
            'jun' => 'nullable|string|max:255',
            'jul' => 'nullable|string|max:255',
            'aug' => 'nullable|string|max:255',
            'sep' => 'nullable|string|max:255',
            'oct' => 'nullable|string|max:255',
            'nov' => 'nullable|string|max:255',
            'dec' => 'nullable|string|max:255',
        ]);

        $remarks = Remarks::updateOrCreate(
            ['cal_id' => $remarks['cal_id']],
            $remarks
        );
        return response()->json($remarks, 201);
    }
    
    public function show($id)
    {
        $calibration = Calibration::with(['planned', 'actual', 'remarks'])->findOrFail($id);
        return Inertia::render('calibration/show', ['calibration' => $calibration]);
    }
    
    public function update(Request $request, $id)
    {
        $calibration = Calibration::findOrFail($id);
        $data = $request->validate([
            'instrument_name_or_eq_code' => 'required|string|max:255',
            'issued_to' => 'nullable|string|max:255',
            'freq_of_cal' => 'nullable|string|max:255',
        ]);

        $calibration->update($data);
        return response()->json($calibration, 200);
    }
    
    public function destroy($id)
    {
        $calibration = Calibration::findOrFail($id);
        
        // Delete related records
        $calibration->planned()->delete();
        $calibration->actual()->delete();
        $calibration->remarks()->delete();
        
        // Then delete the calibration record
        $calibration->delete();
        
        return response()->json(null, 204);
    }
    
    public function updatePlanned(Request $request, $id)
    {
        $planned = Planned::where('cal_id', $id)->firstOrFail();
        $data = $request->validate([
            'jan' => 'nullable|string|max:255',
            'feb' => 'nullable|string|max:255',
            'mar' => 'nullable|string|max:255',
            'apr' => 'nullable|string|max:255',
            'may' => 'nullable|string|max:255',
            'jun' => 'nullable|string|max:255',
            'jul' => 'nullable|string|max:255',
            'aug' => 'nullable|string|max:255',
            'sep' => 'nullable|string|max:255',
            'oct' => 'nullable|string|max:255',
            'nov' => 'nullable|string|max:255',
            'dec' => 'nullable|string|max:255',
        ]);

        $planned->update($data);
        return response()->json($planned, 200);
    }
    
    public function updateActual(Request $request, $id)
    {
        $actual = Actual::where('cal_id', $id)->firstOrFail();
        $data = $request->validate([
            'jan' => 'nullable|string|max:255',
            'feb' => 'nullable|string|max:255',
            'mar' => 'nullable|string|max:255',
            'apr' => 'nullable|string|max:255',
            'may' => 'nullable|string|max:255',
            'jun' => 'nullable|string|max:255',
            'jul' => 'nullable|string|max:255',
            'aug' => 'nullable|string|max:255',
            'sep' => 'nullable|string|max:255',
            'oct' => 'nullable|string|max:255',
            'nov' => 'nullable|string|max:255',
            'dec' => 'nullable|string|max:255',
        ]);

        $actual->update($data);
        return response()->json($actual, 200);
    }
    
    public function updateRemarks(Request $request, $id)
    {
        $remarks = Remarks::where('cal_id', $id)->firstOrFail();
        $data = $request->validate([
            'jan' => 'nullable|string|max:255',
            'feb' => 'nullable|string|max:255',
            'mar' => 'nullable|string|max:255',
            'apr' => 'nullable|string|max:255',
            'may' => 'nullable|string|max:255',
            'jun' => 'nullable|string|max:255',
            'jul' => 'nullable|string|max:255',
            'aug' => 'nullable|string|max:255',
            'sep' => 'nullable|string|max:255',
            'oct' => 'nullable|string|max:255',
            'nov' => 'nullable|string|max:255',
            'dec' => 'nullable|string|max:255',
        ]);

        $remarks->update($data);
        return response()->json($remarks, 200);
    }
}