import { useEffect, useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, FolderKanban, Package2, PenIcon, Trash2Icon, Check, ChevronsUpDown } from "lucide-react";
import { BadgeCheck, Ban } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";

function Notification({
    message,
    type,
    onClose,
}: {
    message: string,
    type: 'success' | 'error',
    onClose: () => void,
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-md shadow-lg",
            type === 'success' ? 'bg-green-500 text-white' : 'bg-destructive text-white'
        )}>
            {type === 'success' ? (
                <Check className="h-5 w-5" />
            ) : (
                <Ban className="h-5 w-5" />
            )}
            <span>{message}</span>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inventory Management', href: '/dashboard' },
  { title: 'Equipment', href: '/inventory' },
];

type Category = {
    id: number;
    name: string;
};

type InventoryItem = {
    id: number;
    categories: Category[];
    office?: { id: number; office_name: string };
    faculty?: { id: number; name: string };
    equipment_name: string;
    serial_number: string;
    date_acquired: string;
    notes?: string;
    office_id?: number;
    faculty_id?: number;
    remarks?: string;
};

export default function InventoryIndex() {
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
    const [form, setForm] = useState<Partial<InventoryItem>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [offices, setOffices] = useState<{ id: number; office_name: string }[]>([]);
    const [faculties, setFaculties] = useState<{ id: number; name: string }[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const fetchInventory = async () => {
        const res = await axios.get<InventoryItem[]>('/api/inventory');
        setInventoryData(res.data.map(item => ({
            ...item,
            faculty: item.faculty ? { id: item.faculty.id, name: item.faculty.name } : undefined,
            categories: item.categories || []
        })));
    };

    const fetchCategories = async () => {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
    };

    const fetchOffices = async () => {
        const res = await axios.get('/api/offices');
        setOffices(res.data);
    };

    const fetchFaculties = async () => {
        const res = await axios.get('/api/faculties');
        setFaculties(res.data);
    };

    useEffect(() => {
        fetchInventory();
        fetchCategories();
        fetchOffices();
        fetchFaculties();
    }, []);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategories(prev => 
            prev.some(c => c.id === category.id) 
                ? prev.filter(c => c.id !== category.id) 
                : [...prev, category]
        );
    };

    const isCategorySelected = (category: Category) => {
        return selectedCategories.some(c => c.id === category.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                faculty_id: form.faculty_id,
                office_id: form.office_id,
                category_ids: selectedCategories.map(cat => cat.id)
            };
            
            if (editId) {
                await axios.put(`/api/inventory/${editId}`, payload);
                setNotification({ message: "Item updated successfully!", type: "success" });
            } else {
                await axios.post('/api/inventory', payload);
                setNotification({ message: "Item added successfully!", type: "success" });
            }
            setForm({});
            setSelectedCategories([]);
            setEditId(null);
            setShowModal(false);
            fetchInventory();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 
                            "Failed to save item. Please check your data.";
            setNotification({ 
                message: errorMessage, 
                type: "error" 
            });
        }
    };

    const handleEdit = (item: InventoryItem) => {
        setEditId(item.id);
        setForm({
            ...item,
            office_id: item.office?.id ?? item.office_id,
            faculty_id: item.faculty?.id ?? item.faculty_id,
        });
        setSelectedCategories(item.categories || []);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                await axios.delete(`/api/inventory/${deleteId}`);
                setNotification({ message: "Item deleted successfully!", type: "success" });
                fetchInventory();
            } catch (err) {
                setNotification({ message: "Failed to delete item.", type: "error" });
            }
            setDeleteId(null);
        }
    };

    const handleToggleRemarks = async (item: InventoryItem) => {
        const newRemarks = item.remarks === "Non-Functional" ? "Functional" : "Non-Functional";
        try {
            await axios.put(`/api/inventory/${item.id}`, { ...item, remarks: newRemarks });
            setNotification({
                message: `Item marked as ${newRemarks}.`,
                type: "success",
            });
            fetchInventory();
        } catch (err) {
            setNotification({
                message: "Failed to update remarks.",
                type: "error",
            });
        }
    };

    const filteredData = inventoryData.filter(item =>
        item.equipment_name.toLowerCase().includes(search.toLowerCase()) ||
        item.serial_number?.toLowerCase().includes(search.toLowerCase()) ||
        item.categories?.some(cat => cat.name.toLowerCase().includes(search.toLowerCase())) ||
        item.date_acquired.toLowerCase().includes(search.toLowerCase()) ||
        (item.notes?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />
            <Toaster />
            <div className="space-y-2.5">
                <Card>
                    <CardHeader>
                        <CardTitle>Inventory Management</CardTitle>
                        <CardDescription>
                            Manage your inventory categories and office locations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <Input
                                    placeholder="Search inventory..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                    className="w-full sm:w-96"
                                />
                                <Button 
                                    onClick={() => { 
                                        setShowModal(true); 
                                        setEditId(null); 
                                        setForm({}); 
                                        setSelectedCategories([]); 
                                    }}
                                    className="w-full sm:w-auto"
                                >
                                    <Package2 className="mr-2 h-4 w-4" />
                                    Add Item
                                </Button>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Categories</TableHead>
                                            <TableHead>Faculty</TableHead>
                                            <TableHead>Equipment</TableHead>
                                            <TableHead>Date Acquired</TableHead>
                                            <TableHead>Notes</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pagedData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                    No inventory items found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            pagedData.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.categories && item.categories.length > 0 ? (
                                                                item.categories.map(cat => (
                                                                    <Badge key={cat.id} variant="secondary">
                                                                        {cat.name}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-muted-foreground text-sm">No categories</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.faculty?.name || <span className="text-muted-foreground">N/A</span>}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{item.equipment_name}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Serial: {item.serial_number || 'N/A'}
                                                        </div>
                                                        {item.office?.office_name && (
                                                            <div className="text-xs text-blue-600 mt-1">
                                                                <Building2 className="inline mr-1 h-3 w-3" />
                                                                {item.office.office_name}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.date_acquired || <span className="text-muted-foreground">N/A</span>}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.notes || <span className="text-muted-foreground italic">No notes</span>}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant={item.remarks === "Non-Functional" ? "destructive" : "default"}
                                                            className="gap-1"
                                                        >
                                                            {item.remarks === "Non-Functional" ? (
                                                                <>
                                                                    <Ban className="h-3 w-3" />
                                                                    Not Working
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <BadgeCheck className="h-3 w-3" />
                                                                    Working
                                                                </>
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleRemarks(item)}
                                                            className="h-8 w-8 p-0"
                                                            title={item.remarks === "Non-Functional" ? "Mark as working" : "Mark as not working"}
                                                        >
                                                            {item.remarks === "Non-Functional" ? (
                                                                <BadgeCheck className="h-4 w-4" />
                                                            ) : (
                                                                <Ban className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(item)}
                                                            className="h-8 w-8 p-0"
                                                            title="Edit"
                                                        >
                                                            <PenIcon className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(item.id!)}
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            title="Delete"
                                                        >
                                                            <Trash2Icon className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex items-center justify-between px-2">
                                <div className="text-sm text-muted-foreground">
                                    Showing <strong>{pagedData.length}</strong> of <strong>{filteredData.length}</strong> items
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{editId ? "Edit Inventory Item" : "Add New Inventory Item"}</DialogTitle>
                        <DialogDescription>
                            {editId ? "Update the details below" : "Fill in the details for the new inventory item"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Equipment Name</label>
                            <Input
                                value={form.equipment_name || ""}
                                onChange={e => setForm({ ...form, equipment_name: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Categories</label>
                            <Popover open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={categoriesOpen}
                                        className="w-full justify-between"
                                    >
                                        {selectedCategories.length > 0 
                                            ? `${selectedCategories.length} selected`
                                            : "Select categories..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search categories..." />
                                        <CommandEmpty>No category found.</CommandEmpty>
                                        <CommandGroup className="max-h-60 overflow-y-auto">
                                            {categories.map((category) => (
                                                <CommandItem
                                                    key={category.id}
                                                    onSelect={() => handleCategorySelect(category)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            isCategorySelected(category) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {category.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <div className="flex flex-wrap gap-2">
                                {selectedCategories.map((category) => (
                                    <Badge key={category.id} className="flex items-center gap-1">
                                        {category.name}
                                        <button
                                            type="button"
                                            onClick={() => handleCategorySelect(category)}
                                            className="ml-1 text-xs"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Office</label>
                                <Select
                                    value={form.office_id?.toString() || ""}
                                    onValueChange={value => setForm({ ...form, office_id: Number(value) })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Office" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {offices.map(office => (
                                            <SelectItem key={office.id} value={office.id.toString()}>
                                                {office.office_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Faculty</label>
                                <Select
                                    value={form.faculty_id?.toString() || ""}
                                    onValueChange={value => setForm({ ...form, faculty_id: Number(value) })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Faculty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {faculties.map(faculty => (
                                            <SelectItem key={faculty.id} value={faculty.id.toString()}>
                                                {faculty.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Serial Number</label>
                                <Input
                                    value={form.serial_number || ""}
                                    onChange={e => setForm({ ...form, serial_number: e.target.value })}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Date Acquired</label>
                                <Input
                                    value={form.date_acquired || ""}
                                    onChange={e => setForm({ ...form, date_acquired: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Notes</label>
                            <Input
                                value={form.notes || ""}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Status</label>
                            <Select
                                value={form.remarks || "Functional"}
                                onValueChange={value => setForm({ ...form, remarks: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Functional">
                                        <div className="flex items-center gap-2">
                                            <BadgeCheck className="h-4 w-4" />
                                            Functional
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Non-Functional">
                                        <div className="flex items-center gap-2">
                                            <Ban className="h-4 w-4" />
                                            Non-Functional
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => { 
                                    setShowModal(false); 
                                    setEditId(null); 
                                    setForm({}); 
                                    setSelectedCategories([]); 
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">{editId ? "Update" : "Add"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this inventory item? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Notification */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </AppLayout>
    );
}