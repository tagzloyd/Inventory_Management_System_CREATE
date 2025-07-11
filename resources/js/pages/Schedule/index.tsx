import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { ScheduleForm } from './schedule-form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Schedule, ScheduleFormValues } from '@/types/schedule';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Schedule',
    href: '/schedule',
  },
];


export default function ScheduleIndex() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      const data = await response.json();
      setSchedules(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch schedules');
      setIsLoading(false);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setCurrentSchedule(schedule);
    setSelectedDate(new Date(schedule.start_time));
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Schedule deleted successfully');
        fetchSchedules();
      } else {
        toast.error('Failed to delete schedule');
      }
    } catch (error) {
      toast.error('Failed to delete schedule');
    }
  };

  const handleFormSubmit = async (formData: ScheduleFormValues, isEdit: boolean) => {
    try {
      const url = isEdit ? `/api/schedules/${formData.id}` : '/api/schedules';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Schedule ${isEdit ? 'updated' : 'created'} successfully`);
        setOpen(false);
        fetchSchedules();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} schedule`);
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} schedule`);
    }
  };

  const getScheduleForDay = (day: Date) => {
    return schedules.find(schedule => 
      isSameDay(new Date(schedule.start_time), day)
    );
  };

  const getDayModifiers = (day: Date) => {
    const schedule = getScheduleForDay(day);
    
    if (schedule) {
      return {
        scheduled: schedule.status === 'Scheduled',
        pending: schedule.status === 'Pending',
        completed: schedule.status === 'Completed',
        cancelled: schedule.status === 'Cancelled'
      };
    }
    
    // Mark weekends as unavailable
    if (day.getDay() === 0 || day.getDay() === 6) {
      return { unavailable: true };
    }
    
    return { available: true };
  };

  const modifiers = {
    scheduled: { scheduled: true },
    pending: { pending: true },
    completed: { completed: true },
    cancelled: { cancelled: true },
    unavailable: { unavailable: true }
  };

  const modifiersStyles = {
    scheduled: {
      border: '2px solid #3b82f6',
      backgroundColor: '#bfdbfe'
    },
    pending: {
      border: '2px solid #f59e0b',
      backgroundColor: '#fef3c7'
    },
    completed: {
      border: '2px solid #10b981',
      backgroundColor: '#d1fae5'
    },
    cancelled: {
      border: '2px solid #ef4444',
      backgroundColor: '#fee2e2'
    },
    unavailable: {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af'
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const modifiers = getDayModifiers(date);
    if (modifiers.unavailable) {
      toast.warning('Selected date is unavailable');
      return;
    }
    
    setSelectedDate(date);
    setCurrentSchedule(null);
    setOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Schedule" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Schedule Management</h1>
          <Button onClick={() => {
            setCurrentSchedule(null);
            setSelectedDate(undefined);
            setOpen(true);
          }}>
            Add Schedule
          </Button>
        </div>

        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={getDayModifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
              disabled={{ dayOfWeek: [0, 6] }} // Disable weekends
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              fromMonth={new Date()} // Only allow future dates
            />
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-blue-200 border border-blue-500"></div>
                <span>Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-amber-200 border border-amber-500"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-emerald-200 border border-emerald-500"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-200 border border-red-500"></div>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-100"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table View */}
        <DataTable
          columns={columns(handleEdit, handleDelete)}
          data={schedules}
          isLoading={isLoading}
          searchKey="name"
        />

        {/* Schedule Form Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <ScheduleForm
              schedule={currentSchedule}
              selectedDate={selectedDate}
              onSubmit={handleFormSubmit}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}