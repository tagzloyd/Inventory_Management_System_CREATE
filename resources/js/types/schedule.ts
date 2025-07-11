export interface Schedule {
    id: number;
    name: string;
    inventory_id: number;
    start_time: string;
    end_time: string;
    purpose: string;
    status: 'Scheduled' | 'Pending' | 'Completed' | 'Cancelled';
    inventory?: {
        id: number;
        equipment_name: string;
    };
}

export interface InventoryItem {
    id: number;
    equipment_name: string;
}

export interface ScheduleFormValues {
    id?: number;
    name: string;
    inventory_id: string;
    start_time: string;
    end_time: string;
    purpose: string;
    status?: string;
}