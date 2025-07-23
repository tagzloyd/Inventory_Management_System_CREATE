<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'inventory_id',
        'schedule_date',
        'status',
        'description'
    ];

    protected $casts = [
        'schedule_date' => 'date'
    ];

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    public static function getEventsForMonth($year, $month)
    {
        return self::whereYear('schedule_date', $year)
            ->whereMonth('schedule_date', $month)
            ->with('inventory')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'title' => $schedule->name,
                    'date' => $schedule->schedule_date->format('Y-m-d'),
                    'day' => $schedule->schedule_date->format('j'),
                    'status' => $schedule->status,
                    'inventory' => $schedule->inventory->equipment_name ?? 'N/A',
                    'inventory_id' => $schedule->inventory_id,
                    'description' => $schedule->description,
                ];
            });
    }

    public static function getEventsForDate($date)
    {
        return self::whereDate('schedule_date', $date)
            ->with('inventory')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'title' => $schedule->name,
                    'date' => $schedule->schedule_date->format('Y-m-d'),
                    'status' => $schedule->status,
                    'inventory' => $schedule->inventory->equipment_name ?? 'N/A',
                    'inventory_id' => $schedule->inventory_id,
                    'description' => $schedule->description,
                ];
            });
    }
}