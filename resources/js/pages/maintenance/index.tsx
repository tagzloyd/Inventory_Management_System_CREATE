import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Toaster, toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';

interface MaintenanceItem {
    id: number;
    daily: string | null;
    weekly: string | null;
    monthly: string | null;
    quarterly: string | null;
    semi_annually: string | null;
    annually: string | null;
    generally?: string | null;
    area_annually?: string | null;
    created_at?: string;
    updated_at?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory Management', href: '/dashboard' },
    { title: 'Maintenance', href: '/maintenance' },
];

type MaintenanceField = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annually' | 'annually';

export default function Maintenance() {
    const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState<MaintenanceItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        daily: '',
        weekly: '',
        monthly: '',
        quarterly: '',
        semi_annually: '',
        annually: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchMaintenanceItems();
    }, []);

    const fetchMaintenanceItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/maintenance/fetch');
            
            // Debug logging
            console.log('API Response:', response);
            
            if (!response.data) {
                throw new Error('No data received from API');
            }

            // Handle both array and object responses
            const items = Array.isArray(response.data) 
                ? response.data 
                : response.data.data || [];
                
            if (!Array.isArray(items)) {
                throw new Error('Expected array but got ' + typeof items);
            }

            setMaintenanceItems(items);
        } catch (err) {
            console.error('Error fetching maintenance items:', err);
            setError('Failed to load maintenance items. Please try again later.');
            setMaintenanceItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        try {
            let promise;
            
            if (editMode && currentItem) {
                promise = axios.put(`/api/maintenance/${currentItem.id}`, formData);
            } else {
                promise = axios.post('/api/maintenance/annual-preventive-maintenance', formData);
            }

            await toast.promise(promise, {
                loading: 'Processing...',
                success: () => {
                    fetchMaintenanceItems();
                    resetForm();
                    return editMode 
                        ? 'Maintenance item updated successfully' 
                        : 'Maintenance item created successfully';
                },
                error: (err) => {
                    if (err.response?.data?.errors) {
                        setErrors(err.response.data.errors);
                    }
                    return err.response?.data?.message || 'An error occurred';
                },
            });
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            daily: '',
            weekly: '',
            monthly: '',
            quarterly: '',
            semi_annually: '',
            annually: '',
        });
        setOpen(false);
        setEditMode(false);
        setCurrentItem(null);
    };

    const handleEdit = (item: MaintenanceItem) => {
        setCurrentItem(item);
        setEditMode(true);
        setFormData({
            daily: item.daily || '',
            weekly: item.weekly || '',
            monthly: item.monthly || '',
            quarterly: item.quarterly || '',
            semi_annually: item.semi_annually || '',
            annually: item.annually || '',
        });
        setOpen(true);
    };

    const handleDelete = (id: number) => {
        toast('Are you sure you want to delete this item?', {
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        await axios.delete(`/api/maintenance/${id}`);
                        toast.success('Maintenance item deleted successfully');
                        fetchMaintenanceItems();
                    } catch (err) {
                        console.error('Error deleting item:', err);
                        toast.error('Failed to delete item');
                    }
                },
            },
             cancel: {
            label: 'Cancel',
            onClick: () => {} // Add empty onClick handler
            },
            duration: 10000,
        });
    };

    const handleInputChange = (field: MaintenanceField, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const maintenanceFields: MaintenanceField[] = ['daily', 'weekly', 'monthly', 'quarterly', 'semi_annually', 'annually'];

    // Add this interface at the top with your other types
    interface EquipmentSummary {
        equipment_name: string;
        total_count: number;
        functional_count: number;
        non_functional_count: number;
        defective_count: number;
        under_repair_count: number;
    }

    // Add this to your component state
    const [equipmentSummary, setEquipmentSummary] = useState<EquipmentSummary[]>([]);

    // Add this to your useEffect to fetch the equipment data
    useEffect(() => {
        fetchMaintenanceItems();
        fetchEquipmentSummary(); // Add this line
    }, []);

    // Add this function to fetch equipment data
    const fetchEquipmentSummary = async () => {
        try {
            const response = await axios.get('/api/existing_equipment');
            setEquipmentSummary(response.data);
        } catch (err) {
            console.error('Error fetching equipment summary:', err);
            toast.error('Failed to load equipment summary');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance" />
            <Toaster position="top-right" richColors expand visibleToasts={3} />

            <div className="p-4 sm:p-6 space-y-6">
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-semibold tracking-tight">
                                Annual Preventive Maintenance Program
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Manage your maintenance tasks and schedules efficiently.
                            </CardDescription>
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="default"
                                    onClick={() => {
                                        setEditMode(false);
                                        resetForm();
                                    }}
                                >
                                    Add New Maintenance
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[1500px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editMode ? 'Edit Maintenance Item' : 'Add New Maintenance Item'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editMode
                                            ? 'Update the maintenance item details below.'
                                            : 'Fill in the details for the new maintenance item.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {maintenanceFields.map((field) => (
                                            <div className="space-y-2" key={field}>
                                                <Label htmlFor={field}>
                                                    {field.split('_').map(word => 
                                                        word.charAt(0).toUpperCase() + word.slice(1)
                                                    ).join(' ')}
                                                </Label>
                                                <Input
                                                    id={field}
                                                    value={formData[field]}
                                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                                    placeholder={`Enter ${field.replace('_', ' ')} maintenance`}
                                                />
                                                {errors[field] && (
                                                    <p className="text-sm text-red-500">{errors[field]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <DialogFooter>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={resetForm}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {editMode ? 'Update' : 'Save'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Maintenance Schedule Table */}
                <Card className="overflow-x-auto shadow-sm border">
                    <CardContent className="p-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <p>Loading maintenance items...</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={7} className="text-center font-semibold text-lg border bg-gray-50">
                                            OFFICE EQUIPMENT/AIRCON UNIT/COMPUTER
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className="border">Daily</TableHead>
                                        <TableHead className="border">Weekly</TableHead>
                                        <TableHead className="border">Monthly</TableHead>
                                        <TableHead className="border">Quarterly</TableHead>
                                        <TableHead className="border">Semi-Annually</TableHead>
                                        <TableHead className="border">Annually</TableHead>
                                        <TableHead className="border">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {maintenanceItems.length > 0 ? (
                                        maintenanceItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="border align-top whitespace-normal p-4">
                                                    {item.daily}
                                                </TableCell>
                                                <TableCell className="border align-top whitespace-normal p-4">
                                                    {item.weekly}
                                                </TableCell>
                                                <TableCell className="border align-top whitespace-normal p-4">
                                                    {item.monthly}
                                                </TableCell>
                                                <TableCell className="border align-top whitespace-normal p-4">
                                                    {item.quarterly}
                                                </TableCell>
                                                <TableCell className="border align-top whitespace-normal p-4">
                                                    {item.semi_annually}
                                                </TableCell>
                                                <TableCell className="border align-top whitespace-normal p-4">
                                                    {item.annually}
                                                </TableCell>
                                                <TableCell className="border space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-4">
                                                {error ? 'Error loading maintenance items' : 'No maintenance items found'}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Equipment Inventory Table */}
                <Card className="overflow-x-auto shadow-sm border">
                    <CardContent className="p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={7} className="text-left font-semibold text-lg border bg-gray-50">
                                        Based on the Inventory of ABE Equipment (As of June 2024)
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="border">EXISTING EQUIPMENT</TableHead>
                                    <TableHead className="border">NUMBER OF AVAILABLE UNITS</TableHead>
                                    <TableHead className="border">Update in July 2025</TableHead>
                                    <TableHead className="border">Remarks</TableHead>
                                    <TableHead className="border">Remark (Maintenance Schedule)</TableHead>
                                    <TableHead className="border">Activities</TableHead>
                                    <TableHead className="border">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {equipmentSummary.length > 0 ? (
                                    equipmentSummary.map((item) => (
                                        <TableRow key={item.equipment_name}>
                                            <TableCell className="border">{item.equipment_name}</TableCell>
                                            <TableCell className="border"></TableCell>
                                            <TableCell className="border text-center">{item.total_count}</TableCell>
                                            <TableCell className="border">
                                                {item.functional_count} functional, 
                                                <br />
                                                {item.non_functional_count} non-functional,
                                                <br />
                                                {item.defective_count} defective,
                                                <br />
                                                {item.under_repair_count} under repair
                                            </TableCell>
                                            <TableCell className="border"></TableCell>
                                            <TableCell className="border"></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4">
                                            No equipment data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}