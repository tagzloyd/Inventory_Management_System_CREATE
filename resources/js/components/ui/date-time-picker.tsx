// components/ui/date-time-picker.tsx
import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimePicker } from '@/components/ui/time-picker';
import { addDays, isSameDay, isBefore } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  return Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1);
  });
}

export function DateTimePicker({
  date,
  setDate,
  minDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
  minDate?: Date;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP HH:mm') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              onClick={() => setDate(addDays(date, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">
              {format(date, 'MMMM yyyy')}
            </div>
            <Button
              variant="ghost"
              onClick={() => setDate(addDays(date, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(date).map((day) => (
              <Button
                key={day.toISOString()}
                variant={isSameDay(day, date) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  const newDate = new Date(day);
                  newDate.setHours(date.getHours());
                  newDate.setMinutes(date.getMinutes());
                  setDate(newDate);
                }}
                disabled={minDate ? isBefore(day, minDate) : false}
              >
                {format(day, 'd')}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-3 border-t border-border">
          <TimePicker
            date={date}
            setDate={setDate}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}