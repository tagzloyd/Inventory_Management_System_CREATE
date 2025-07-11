<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\Inventory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SchedulesController extends Controller
{
    public function __construct()
    {
        // Set default timezone for all operations
        date_default_timezone_set('Asia/Manila');
    }
    
    public function index()
    {
        return Inertia::render('Schedule/index', []);
    }
    
    public function fetchSchedules()
    {
        try {
            $schedules = Schedule::with(['inventory' => function($query) {
                $query->select('id', 'equipment_name');
            }])
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function ($schedule) {
                // Convert times to Asia/Manila timezone for display
                $schedule->start_time = Carbon::parse($schedule->start_time)->timezone('Asia/Manila');
                $schedule->end_time = Carbon::parse($schedule->end_time)->timezone('Asia/Manila');
                return $schedule;
            });
            
            return response()->json($schedules);
            
        } catch (Exception $e) {
            Log::error('Error fetching schedules: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch schedules',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function fetchAvailableInventory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Parse with Manila timezone
            $start = Carbon::parse($request->start_time, 'Asia/Manila')->setTimezone('UTC');
            $end = Carbon::parse($request->end_time, 'Asia/Manila')->setTimezone('UTC');
            
            // Get inventory items that are already scheduled during this time
            $scheduledIds = Schedule::where(function($query) use ($start, $end) {
                $query->whereBetween('start_time', [$start, $end])
                      ->orWhereBetween('end_time', [$start, $end])
                      ->orWhere(function($query) use ($start, $end) {
                          $query->where('start_time', '<', $start)
                                ->where('end_time', '>', $end);
                      });
            })
            ->where('status', '!=', 'Cancelled')
            ->pluck('inventory_id');
            
            // Get available inventory
            $availableInventory = Inventory::whereNotIn('id', $scheduledIds)
                ->select('id', 'equipment_name')
                ->orderBy('equipment_name')
                ->get();
                
            return response()->json($availableInventory);
            
        } catch (Exception $e) {
            Log::error('Error fetching available inventory: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch available equipment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'inventory_id' => 'required|exists:inventory,id',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'purpose' => 'required|string|max:500',
                'status' => 'nullable|string|in:Scheduled,Pending,Completed,Cancelled',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Convert from Manila time to UTC for storage
            $startTime = Carbon::parse($request->start_time, 'Asia/Manila')->setTimezone('UTC');
            $endTime = Carbon::parse($request->end_time, 'Asia/Manila')->setTimezone('UTC');
            
            // Check for scheduling conflicts
            $conflict = Schedule::where('inventory_id', $request->inventory_id)
                ->where('status', '!=', 'Cancelled')
                ->where(function($query) use ($startTime, $endTime) {
                    $query->where(function($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<', $endTime)
                          ->where('end_time', '>', $startTime);
                    });
                })
                ->exists();
                
            if ($conflict) {
                return response()->json([
                    'message' => 'This equipment is already scheduled for the selected time period',
                ], 409);
            }
            
            $schedule = Schedule::create([
                'name' => $request->name,
                'inventory_id' => $request->inventory_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'purpose' => $request->purpose,
                'status' => $request->status ?? 'Scheduled',
            ]);
            
            // Convert back to Manila time for response
            $schedule->start_time = $schedule->start_time->timezone('Asia/Manila');
            $schedule->end_time = $schedule->end_time->timezone('Asia/Manila');
            
            return response()->json($schedule->load('inventory'), 201);
            
        } catch (Exception $e) {
            Log::error('Error creating schedule: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create schedule',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'inventory_id' => 'required|exists:inventory,id',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'purpose' => 'required|string|max:500',
                'status' => 'nullable|string|in:Scheduled,Pending,Completed,Cancelled',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $schedule = Schedule::findOrFail($id);
            
            // Convert from Manila time to UTC for storage
            $startTime = Carbon::parse($request->start_time, 'Asia/Manila')->setTimezone('UTC');
            $endTime = Carbon::parse($request->end_time, 'Asia/Manila')->setTimezone('UTC');
            
            // Check for scheduling conflicts (excluding current schedule)
            $conflict = Schedule::where('inventory_id', $request->inventory_id)
                ->where('id', '!=', $id)
                ->where('status', '!=', 'Cancelled')
                ->where(function($query) use ($startTime, $endTime) {
                    $query->where(function($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<', $endTime)
                          ->where('end_time', '>', $startTime);
                    });
                })
                ->exists();
                
            if ($conflict) {
                return response()->json([
                    'message' => 'This equipment is already scheduled for the selected time period',
                ], 409);
            }
            
            $schedule->update([
                'name' => $request->name,
                'inventory_id' => $request->inventory_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'purpose' => $request->purpose,
                'status' => $request->status ?? $schedule->status,
            ]);
            
            // Convert back to Manila time for response
            $schedule->start_time = $schedule->start_time->timezone('Asia/Manila');
            $schedule->end_time = $schedule->end_time->timezone('Asia/Manila');
            
            return response()->json($schedule->load('inventory'));
            
        } catch (Exception $e) {
            Log::error('Error updating schedule: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update schedule',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function destroy($id)
    {
        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->delete();
            
            return response()->noContent();
            
        } catch (Exception $e) {
            Log::error('Error deleting schedule: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete schedule',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}