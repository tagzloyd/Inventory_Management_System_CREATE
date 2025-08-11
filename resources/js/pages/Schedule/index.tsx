import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, Edit, Plus, ChevronLeft, ChevronRight, Calendar, Table, Eye, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@radix-ui/react-label';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inventory Management',
    href: '/dashboard',
  },
  {
    title: 'Schedule',
    href: '/schedule',
  },
];

const daysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const firstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  day?: number;
  status: string;
  inventory: string;
  inventory_id: number;
  description?: string;
}

interface InventoryItem {
  id: number;
  equipment_name: string;
}

export default function Index() {
  const { props } = usePage();
  const inventoryItems = props.inventoryItems as InventoryItem[];
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [schedule, setSchedule] = useState<Record<string, ScheduleEvent[]>>({});
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<ScheduleEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    inventory_id: '',
    schedule_date: selectedDate?.toISOString().split('T')[0] || '',
    description: '',
    status: 'Scheduled'
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysCount = daysInMonth(currentMonth, currentYear);
  const firstDay = firstDayOfMonth(currentMonth, currentYear);

  useEffect(() => {
    fetchMonthSchedule();
  }, [currentMonth, currentYear]);

  const [scheduledInventoryIds, setScheduledInventoryIds] = useState<number[]>([]);
  const fetchMonthSchedule = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/schedules/month`, {
        params: {
          year: currentYear,
          month: currentMonth + 1
        }
      });
      
      const schedulesByDate: Record<string, ScheduleEvent[]> = {};
      response.data.events.forEach((event: any) => {
        const dateKey = event.date.split('T')[0]; 
        if (!schedulesByDate[dateKey]) {
          schedulesByDate[dateKey] = [];
        }
        schedulesByDate[dateKey].push({
          ...event,
          date: dateKey
        });
      });
      setSchedule(schedulesByDate);
      setScheduledInventoryIds(response.data.scheduledInventoryIds || []);
    } catch (error) {
      console.error('Error fetching month events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name,
        inventory_id: parseInt(formData.inventory_id),
        schedule_date: formData.schedule_date,
        description: formData.description,
        status: formData.status
      };

      let response;
      if (currentEvent) {
        response = await axios.put(`/api/schedules/${currentEvent.id}`, payload);
      } else {
        response = await axios.post('/api/schedules', payload);
      }
      
      setIsDialogOpen(false);
      await fetchMonthSchedule();
      resetForm();
      
      return response.data;
    } catch (error) {
      console.error('Error saving schedule:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log('Server response:', error.response.data);
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (eventId: number) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        await axios.delete(`/api/schedules/${eventId}`);
        fetchMonthSchedule();
        setIsEventDialogOpen(false);
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      inventory_id: '',
      schedule_date: selectedDate?.toISOString().split('T')[0] || '',
      description: '',
      status: 'Scheduled'
    });
    setCurrentEvent(null);
  };

  const openEditDialog = (event: ScheduleEvent) => {
    setCurrentEvent(event);
    setFormData({
      name: event.title,
      inventory_id: event.inventory_id.toString(),
      schedule_date: event.date,
      description: event.description || '',
      status: event.status
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = (date: Date) => {
    setSelectedDate(date);
    setFormData({
      name: '',
      inventory_id: '',
      schedule_date: date.toISOString().split('T')[0],
      description: '',
      status: 'Scheduled'
    });
    setIsDialogOpen(true);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const getEventsForDay = (day: number) => {
    const dateKey = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return schedule[dateKey] || [];
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Schedule" />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Schedule Management
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={goToToday}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="hidden sm:inline-flex"
                >
                  Today
                </Button>
                <Button
                  onClick={() => openCreateDialog(new Date())}
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Schedule
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="calendar" className="w-full">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-b">
                <TabsList className="grid w-full grid-cols-2 max-w-xs">
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Table
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={goToToday}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="sm:hidden"
                  >
                    Today
                  </Button>
                  <Button
                    onClick={() => openCreateDialog(new Date())}
                    size="sm"
                    className="sm:hidden"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="calendar" className="m-0">
                {/* Calendar Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
                  <div className="flex items-center space-x-2">
                    <Button 
                      onClick={prevMonth}
                      variant="outline"
                      size="icon"
                      disabled={isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {months[currentMonth]} {currentYear}
                    </h2>
                    <Button 
                      onClick={nextMonth}
                      variant="outline"
                      size="icon"
                      disabled={isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-px bg-gray-100 border-t">
                  {daysOfWeek.map(day => (
                    <div key={day} className="bg-gray-50 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-100">
                  {isLoading ? (
                    Array.from({ length: 42 }).map((_, index) => (
                      <div key={`skeleton-${index}`} className="bg-white h-32 p-2">
                        <Skeleton className="h-4 w-4 mb-2" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {/* Empty cells for days before the first day of the month */}
                      {Array.from({ length: firstDay }).map((_, index) => (
                        <div key={`empty-${index}`} className="bg-white h-32 p-2 border border-gray-100"></div>
                      ))}

                      {/* Days of the month */}
                      {Array.from({ length: daysCount }).map((_, index) => {
                        const day = index + 1;
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const daySchedule = schedule[dateStr] || [];
                        const isToday = 
                          currentMonth === new Date().getMonth() && 
                          currentYear === new Date().getFullYear() && 
                          day === new Date().getDate();

                        return (
                          <div 
                            key={`day-${day}`}
                            className={`relative bg-white h-32 p-2 border border-gray-100 hover:bg-gray-50 transition-colors
                              ${isToday ? 'ring-1 ring-blue-500' : ''}
                            `}
                          >
                            {/* Day number and add button */}
                            <div className="flex justify-between items-center">
                              <span className={`text-sm font-medium 
                                ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-900'}
                              `}>
                                {day}
                              </span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openCreateDialog(new Date(currentYear, currentMonth, day));
                                    }}
                                  >
                                    <Plus className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Add schedule</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>

                            {/* Event previews */}
                            <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                              {daySchedule.map(event => (
                                <div 
                                  key={`event-${event.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(event);
                                  }}
                                  className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-90 border-l-4 ${getStatusColor(event.status)}`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium truncate">{event.title}</span>
                                    <Badge 
                                      variant={getStatusBadgeVariant(event.status)}
                                      className="ml-1"
                                    >
                                      {event.status}
                                    </Badge>
                                  </div>
                                  <div className="text-[0.7rem] text-gray-600 truncate">{event.inventory}</div>
                                </div>
                              ))}
                              {daySchedule.length === 0 && (
                                <div className="text-xs text-gray-400 italic p-1">No Schedule</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="table" className="m-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Equipment
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(schedule).flatMap(([date, dateSchedule]) => 
                        dateSchedule.map(event => (
                          <tr key={event.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-0">
                                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                  {event.description && (
                                    <div className="text-xs text-gray-500 truncate max-w-xs">{event.description}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.inventory}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={getStatusBadgeVariant(event.status)}>
                                {event.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEventClick(event)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openEditDialog(event)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    onClick={() => handleDelete(event.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Event Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {currentEvent ? 'Edit Schedule' : 'Create New Schedule'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter schedule name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="inventory">Inventory Item</Label>
                <Select
                  value={formData.inventory_id}
                  onValueChange={(value) => setFormData({...formData, inventory_id: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select inventory item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map(item => {
                      const isScheduled = scheduledInventoryIds.includes(item.id);
                      const isCurrentItem = currentEvent?.inventory_id === item.id;
                      
                      return (
                        <SelectItem 
                          key={item.id} 
                          value={item.id.toString()}
                          disabled={isScheduled && !isCurrentItem}
                          className={isScheduled && !isCurrentItem ? 'opacity-50' : ''}
                        >
                          {item.equipment_name}
                          {isScheduled && !isCurrentItem && ' (Scheduled)'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Schedule Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.schedule_date}
                  onChange={(e) => setFormData({...formData, schedule_date: e.target.value})}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter any additional details..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Schedule'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg">{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Inventory Item</Label>
                  <p>{selectedEvent.inventory}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Date</Label>
                  <p>
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={getStatusBadgeVariant(selectedEvent.status)}>
                  {selectedEvent.status}
                </Badge>
              </div>
              {selectedEvent.description && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm whitespace-pre-line text-gray-700">{selectedEvent.description}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEventDialogOpen(false);
                  openEditDialog(selectedEvent);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedEvent.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AppLayout>
  );
}