import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Schedule } from '@/types/schedule';

export const columns = (
    handleEdit: (schedule: Schedule) => void,
    handleDelete: (id: number) => void
): ColumnDef<Schedule>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'inventory.equipment_name',
        header: 'Equipment',
    },
    {
        accessorKey: 'start_time',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Start Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => format(new Date(row.getValue('start_time')), 'PPpp'),
    },
    {
        accessorKey: 'end_time',
        header: 'End Time',
        cell: ({ row }) => format(new Date(row.getValue('end_time')), 'PPpp'),
    },
    {
        accessorKey: 'purpose',
        header: 'Purpose',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as Schedule['status'];
            let variant: 'default' | 'secondary' | 'destructive' | 'outline';
            let className = '';
            
            switch (status) {
                case 'Scheduled':
                    variant = 'default';
                    break;
                case 'Pending':
                    variant = 'secondary';
                    break;
                case 'Completed':
                    variant = 'secondary';
                    className = 'bg-green-500 hover:bg-green-600';
                    break;
                case 'Cancelled':
                    variant = 'destructive';
                    break;
                default:
                    variant = 'outline';
            }
            
            return (
                <Badge variant={variant} className={className}>
                    {status}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const schedule = row.original;
            
            return (
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];