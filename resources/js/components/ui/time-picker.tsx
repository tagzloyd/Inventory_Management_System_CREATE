// components/ui/time-picker.tsx
import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TimePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const setHours = (h: number) => {
    const newDate = new Date(date);
    newDate.setHours(h);
    setDate(newDate);
  };

  const setMinutes = (m: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(m);
    setDate(newDate);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHours(hours === 23 ? 0 : hours + 1)}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium">{hours.toString().padStart(2, '0')}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHours(hours === 0 ? 23 : hours - 1)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <span className="text-lg font-medium">:</span>
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMinutes(minutes === 59 ? 0 : minutes + 1)}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium">{minutes.toString().padStart(2, '0')}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMinutes(minutes === 0 ? 59 : minutes - 1)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}