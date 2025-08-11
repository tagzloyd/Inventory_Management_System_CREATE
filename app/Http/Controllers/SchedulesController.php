<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Schedule;
use Illuminate\Http\Request;
use App\Models\Inventory;
use Illuminate\Support\Facades\Validator;

class SchedulesController extends Controller
{
    public function index()
    {
        return Inertia::render('Schedule/index', [
            'inventoryItems' => Inventory::select('id', 'equipment_name')->get(),
        ]);
    }
    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'Cancelled');
    }
    public function getMonthEvents(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'year' => 'required|integer',
            'month' => 'required|integer|between:1,12',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $events = Schedule::with('inventory:id,equipment_name')
            ->whereYear('schedule_date', $request->year)
            ->whereMonth('schedule_date', $request->month)
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->name,
                    'date' => $event->schedule_date->format('Y-m-d'),
                    'status' => $event->status,
                    'inventory' => $event->inventory->equipment_name,
                    'inventory_id' => $event->inventory_id,
                    'description' => $event->description,
                ];
            });

        // Only get inventory IDs that are currently scheduled (status = Scheduled)
        $scheduledInventoryIds = Schedule::whereYear('schedule_date', $request->year)
            ->whereMonth('schedule_date', $request->month)
            ->where('status', 'Scheduled')  // Only include 'Scheduled' status
            ->pluck('inventory_id')
            ->unique()
            ->values()
            ->toArray();

        return response()->json([
            'events' => $events,
            'scheduledInventoryIds' => $scheduledInventoryIds
        ]);
    }

    public function getDateEvents(Request $request, $date)
    {
        $validator = Validator::make(['date' => $date], [
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $events = Schedule::with('inventory:id,equipment_name')
            ->whereDate('schedule_date', $date)
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->name,
                    'date' => $event->schedule_date,
                    'status' => $event->status,
                    'inventory' => $event->inventory->equipment_name,
                    'inventory_id' => $event->inventory_id,
                    'description' => $event->description,
                ];
            });

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'inventory_id' => 'required|exists:inventory,id',
            'schedule_date' => 'required|date',
            'status' => 'sometimes|in:Scheduled,Completed,Cancelled',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Check if inventory is already scheduled for this date
        $existingSchedule = Schedule::where('inventory_id', $request->inventory_id)
            ->whereDate('schedule_date', $request->schedule_date)
            ->where('status', 'Scheduled')  // Only check for 'Scheduled' status
            ->first();

        if ($existingSchedule) {
            return response()->json([
                'error' => 'This equipment is already scheduled for the selected date'
            ], 422);
        }

        try {
            $schedule = Schedule::create([
                'name' => $request->name,
                'inventory_id' => $request->inventory_id,
                'schedule_date' => $request->schedule_date,
                'description' => $request->description,
                'status' => $request->status ?? 'Scheduled',
            ]);
            
            return response()->json([
                'message' => 'Schedule created successfully',
                'schedule' => $schedule
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Schedule creation failed:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    public function show(Schedule $schedule)
    {
        return response()->json([
            'id' => $schedule->id,
            'title' => $schedule->name,
            'date' => $schedule->schedule_date,
            'status' => $schedule->status,
            'inventory' => $schedule->inventory->equipment_name,
            'inventory_id' => $schedule->inventory_id,
            'description' => $schedule->description,
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'inventory_id' => 'sometimes|required|exists:inventory,id',
            'schedule_date' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:Scheduled,Completed,Cancelled',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Check if inventory is already scheduled for the new date (if changed)
        if ($request->has('inventory_id') || $request->has('schedule_date')) {
            $existingSchedule = Schedule::where('inventory_id', $request->inventory_id ?? $schedule->inventory_id)
                ->whereDate('schedule_date', $request->schedule_date ?? $schedule->schedule_date)
                ->where('status', 'Scheduled')  // Only check for 'Scheduled' status
                ->where('id', '!=', $schedule->id)
                ->first();

            if ($existingSchedule) {
                return response()->json([
                    'error' => 'This equipment is already scheduled for the selected date'
                ], 422);
            }
        }

        $schedule->update($request->all());

        return response()->json([
            'id' => $schedule->id,
            'title' => $schedule->name,
            'date' => $schedule->schedule_date,
            'status' => $schedule->status,
            'inventory' => $schedule->inventory->equipment_name,
            'inventory_id' => $schedule->inventory_id,
            'description' => $schedule->description,
        ]);
    }
    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}