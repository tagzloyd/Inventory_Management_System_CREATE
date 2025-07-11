import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Schedule, InventoryItem, ScheduleFormValues } from '@/types/schedule';

const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Name is required').max(255),
    inventory_id: z.string().min(1, 'Equipment is required'),
    start_time: z.date(),
    end_time: z.date(),
    purpose: z.string().min(1, 'Purpose is required').max(500),
    status: z.string().optional(),
});

interface ScheduleFormProps {
    schedule: Schedule | null;
    onSubmit: (values: ScheduleFormValues, isEdit: boolean) => void;
    onCancel: () => void;
}

export function ScheduleForm({ schedule, onSubmit, onCancel }: ScheduleFormProps) {
    const [availableEquipment, setAvailableEquipment] = useState<InventoryItem[]>([]);
    const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);
    const isEdit = !!schedule;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: schedule?.id || undefined,
            name: schedule?.name || '',
            inventory_id: schedule?.inventory_id?.toString() || '',
            start_time: schedule?.start_time ? new Date(schedule.start_time) : new Date(),
            end_time: schedule?.end_time ? new Date(schedule.end_time) : new Date(Date.now() + 3600000),
            purpose: schedule?.purpose || '',
            status: schedule?.status || 'Scheduled',
        },
    });

    const startTime = form.watch('start_time');
    const endTime = form.watch('end_time');

    useEffect(() => {
        if (startTime && endTime) {
            fetchAvailableEquipment(startTime, endTime);
        }
    }, [startTime, endTime]);

    const fetchAvailableEquipment = async (start: Date, end: Date) => {
    try {
        setIsLoadingEquipment(true);
        const params = new URLSearchParams({
            start_time: start.toISOString(),
            end_time: end.toISOString(),
        });
        
        const response = await fetch(`/api/schedules/available-inventory?${params}`);

            if (response.ok) {
                const data = await response.json();
                setAvailableEquipment(data);
                
                // If editing and current equipment is not available, add it to the list
                if (isEdit && schedule?.inventory_id && !data.some((e: InventoryItem) => e.id === schedule.inventory_id)) {
                    setAvailableEquipment(prev => [
                        ...prev,
                        { id: schedule.inventory_id, equipment_name: schedule.inventory?.equipment_name || '' }
                    ]);
                }
            } else {
                toast.error('Failed to fetch available equipment');
            }
        } catch (error) {
            toast.error('Failed to fetch available equipment');
        } finally {
            setIsLoadingEquipment(false);
        }
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit({
            ...values,
            start_time: values.start_time.toISOString(),
            end_time: values.end_time.toISOString(),
        }, isEdit);
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter schedule name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="inventory_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Equipment</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select equipment" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoadingEquipment ? (
                                        <div className="p-2 text-center text-sm">Loading equipment...</div>
                                    ) : availableEquipment.length > 0 ? (
                                        availableEquipment.map((equipment) => (
                                            <SelectItem key={equipment.id} value={equipment.id.toString()}>
                                                {equipment.equipment_name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-center text-sm">No equipment available for selected time</div>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Time</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP HH:mm')
                                                ) : (
                                                    <span>Pick a date and time</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                        <div className="p-3">
                                            <Input
                                                type="time"
                                                value={field.value ? format(field.value, 'HH:mm') : ''}
                                                onChange={(e) => {
                                                    const time = e.target.value;
                                                    if (field.value && time) {
                                                        const [hours, minutes] = time.split(':');
                                                        const newDate = new Date(field.value);
                                                        newDate.setHours(parseInt(hours, 10));
                                                        newDate.setMinutes(parseInt(minutes, 10));
                                                        field.onChange(newDate);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="end_time"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Time</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP HH:mm')
                                                ) : (
                                                    <span>Pick a date and time</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < startTime}
                                            initialFocus
                                        />
                                        <div className="p-3">
                                            <Input
                                                type="time"
                                                value={field.value ? format(field.value, 'HH:mm') : ''}
                                                onChange={(e) => {
                                                    const time = e.target.value;
                                                    if (field.value && time) {
                                                        const [hours, minutes] = time.split(':');
                                                        const newDate = new Date(field.value);
                                                        newDate.setHours(parseInt(hours, 10));
                                                        newDate.setMinutes(parseInt(minutes, 10));
                                                        field.onChange(newDate);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Purpose</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter purpose of the schedule"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isEdit && (
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {isEdit ? 'Update Schedule' : 'Create Schedule'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}