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

function Notification({
    message,
    type,
    onClose,
    duration = 3000,
}: {
    message: string,
    type: 'success' | 'error',
    onClose: () => void,
    duration?: number
}) {
    useEffect(() => {
        if (!duration) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`fixed top-6 right-6 z-[9999] px-4 py-3 rounded shadow-lg text-white transition-all
            ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="flex items-center gap-2">
                <span>{message}</span>
                <button className="ml-2 text-white/80 hover:text-white" onClick={onClose}>×</button>
            </div>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '/inventory' },
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
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-700 rounded-full p-2">
                            <Package2 className="w-6 h-6" />
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                    </div>
                    <Button onClick={() => { setShowModal(true); setEditId(null); setForm({}); setSelectedCategories([]); }}>
                        + Add Item
                    </Button>
                </div>
                
                <p className="mb-6 text-gray-600">
                    Welcome to your inventory management page. Here you can add, edit, or remove equipment records.
                </p>
                
                <div className="mb-4 flex justify-end">
                    <Input
                        placeholder="Search inventory..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-64"
                    />
                </div>
                
                <div className="bg-white rounded-xl shadow border p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Categories</TableHead>
                                <TableHead>Faculty</TableHead>
                                <TableHead>Equipment</TableHead>
                                <TableHead>Date Acquired</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Remarks</TableHead>
                                <TableHead className="text-center w-40">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pagedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-400 py-6">
                                        No inventory data.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedData.map(item => (
                                    <TableRow key={item.id} className="hover:bg-blue-50 transition">
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {item.categories && item.categories.length > 0 ? (
                                                    item.categories.map(cat => (
                                                        <Badge key={cat.id} variant="outline">
                                                            {cat.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic">No categories</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.faculty?.name || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">{item.equipment_name}</div>
                                            <div className="text-xs text-gray-500">
                                                Serial No: {item.serial_number || 'N/A'}
                                            </div>
                                            {item.office?.office_name && (
                                                <div className="text-xs text-blue-700 mt-1">
                                                    Located at {item.office.office_name}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {item.date_acquired || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {item.notes || <span className="italic text-gray-400">No notes</span>}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
                                                ${item.remarks === "Non-Functional" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                {item.remarks === "Non-Functional" ? (
                                                    <>
                                                        <Ban className="w-4 h-4" />
                                                        Not Working
                                                    </>
                                                ) : (
                                                    <>
                                                        <BadgeCheck className="w-4 h-4" />
                                                        Working
                                                    </>
                                                )}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleRemarks(item)}
                                            >
                                                {item.remarks === "Non-Functional" ? (
                                                    <BadgeCheck className="w-4 h-4" />
                                                ) : (
                                                    <Ban className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <PenIcon className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id!)}
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <div className="space-x-2">
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
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                            onClick={() => { setShowModal(false); setEditId(null); setForm({}); setSelectedCategories([]); }}
                            type="button"
                        >
                            ×
                        </button>
                        <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Item" : "Add Item"}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Equipment Name*</label>
                                <Input
                                    value={form.equipment_name || ""}
                                    onChange={e => setForm({ ...form, equipment_name: e.target.value })}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Categories*</label>
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
                                <div className="flex flex-wrap gap-2 mt-2">
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
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Office*</label>
                                <select
                                    className="border px-3 py-2 rounded w-full"
                                    value={form.office_id || ""}
                                    onChange={e => setForm({ ...form, office_id: Number(e.target.value) })}
                                    required
                                >
                                    <option value="">Select Office</option>
                                    {offices.map(office => (
                                        <option key={office.id} value={office.id}>
                                            {office.office_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Faculty*</label>
                                <select
                                    className="border px-3 py-2 rounded w-full"
                                    value={form.faculty_id || ""}
                                    onChange={e => setForm({ ...form, faculty_id: Number(e.target.value) })}
                                    required
                                >
                                    <option value="">Select Faculty</option>
                                    {faculties.map(faculty => (
                                        <option key={faculty.id} value={faculty.id}>
                                            {faculty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Serial Number</label>
                                <Input
                                    value={form.serial_number || ""}
                                    onChange={e => setForm({ ...form, serial_number: e.target.value })}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Date Acquired*</label>
                                <Input
                                    
                                    value={form.date_acquired || ""}
                                    onChange={e => setForm({ ...form, date_acquired: e.target.value })}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <Input
                                    value={form.notes || ""}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Remarks</label>
                                <Input
                                    value={form.remarks || ""}
                                    onChange={e => setForm({ ...form, remarks: e.target.value })}
                                />
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setShowModal(false); setEditId(null); setForm({}); setSelectedCategories([]); }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">{editId ? "Update" : "Add"}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                        <h2 className="text-lg font-semibold mb-4">Delete Item</h2>
                        <p className="mb-6">Are you sure you want to delete this item?</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeleteId(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                    duration={3000}
                />
            )}
        </AppLayout>
    );
}