import { useEffect, useState } from "react";
    import AppLayout from '@/layouts/app-layout';
    import { type BreadcrumbItem } from '@/types';
    import { Head } from '@inertiajs/react';
    import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
    import axios from "axios";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Building2, FolderKanban, Package2, PenIcon, Trash2Icon } from "lucide-react"; // shadcn/lucide icons
    import { BadgeCheck, Ban } from "lucide-react";

    // --- Notification component ---
    function Notification({
        message,
        type,
        onClose,
        duration = 3000, // default 3 seconds
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
    // ---

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventory', href: '/inventory' },
    ];

    type InventoryItem = {
        id: number;
        category?: { id: number; category_name: string };
        office?: { id: number; office_name: string };
        equipment_name: string;
        serial_number: string;
        date_acquired: string;
        notes?: string;
        category_id?: number;
        office_id?: number;
        remarks?: string;
    };

    export default function InventoryIndex() {
        const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
        const [form, setForm] = useState<Partial<InventoryItem>>({});
        const [editId, setEditId] = useState<number | null>(null);
        const [categories, setCategories] = useState<{ id: number; category_name: string }[]>([]);
        const [offices, setOffices] = useState<{ id: number; office_name: string }[]>([]);
        const [showModal, setShowModal] = useState(false);
        const [deleteId, setDeleteId] = useState<number | null>(null);

        // Notification state
        const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

        // Paging state
        const [currentPage, setCurrentPage] = useState(1);
        const pageSize = 10;
        const totalPages = Math.ceil(inventoryData.length / pageSize);

        // Search state
        const [search, setSearch] = useState("");

        // Fetch inventory
        const fetchInventory = async () => {
            const res = await axios.get('/api/inventory');
            setInventoryData(res.data);
        };

        useEffect(() => {
            fetchInventory();
            fetchCategories();
            fetchOffices();
        }, []);

        const fetchCategories = async () => {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        };

        const fetchOffices = async () => {
            const res = await axios.get('/api/offices');
            setOffices(res.data);
        };

        // Handle form submit (create or update)
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                if (editId) {
                    await axios.put(`/api/inventory/${editId}`, form);
                    setNotification({ message: "Item updated successfully!", type: "success" });
                } else {
                    await axios.post('/api/inventory', form);
                    setNotification({ message: "Item added successfully!", type: "success" });
                }
                setForm({});
                setEditId(null);
                setShowModal(false);
                fetchInventory();
            } catch (err) {
                setNotification({ message: "Failed to save item. It either already exists or is invalid.", type: "error" }), console.error(err);
            }
        };

        // Handle edit
        const handleEdit = (item: InventoryItem) => {
            setEditId(item.id);
            setForm({
                ...item,
                category_id: item.category?.id ?? item.category_id,
                office_id: item.office?.id ?? item.office_id,
            });
            setShowModal(true);
        };

        // Handle delete
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

        // Function to toggle remarks between "Functionable" and "Non-Functionable"
        const handleToggleRemarks = async (item: InventoryItem) => {
            const newRemarks = item.remarks === "Non-Functionable" ? "Functionable" : "Non-Functionable";
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

        // Filtered and paged data for search and paging
        const filteredData = inventoryData.filter(item =>
            item.equipment_name.toLowerCase().includes(search.toLowerCase()) ||
            item.serial_number?.toLowerCase().includes(search.toLowerCase()) ||
            item.category?.category_name.toLowerCase().includes(search.toLowerCase()) ||
            item.date_acquired.toLowerCase().includes(search.toLowerCase()) ||
            (item.notes?.toLowerCase().includes(search.toLowerCase()) ?? false)
        );
        const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        const totalFilteredPages = Math.ceil(filteredData.length / pageSize);

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
                        <Button onClick={() => { setShowModal(true); setEditId(null); setForm({}); }}>
                            + Add Item
                        </Button>
                    </div>
                    <p className="mb-6 text-gray-600">
                        Welcome to your inventory management page. Here you can add, edit, or remove equipment records, and keep track of all your assets in one place.
                        <br />
                        <span className="text-sm text-blue-700">
                            Tip: Use the search bar to quickly find equipment by name, serial number, or category!
                        </span>
                    </p>
                    {/* Search Bar */}
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
                                    {/* <TableHead className="w-10">ID</TableHead> */}
                                    <TableHead>
                                        <span className="inline-flex items-center gap-1">
                                            <FolderKanban className="w-4 h-4 text-green-600" />
                                            Category
                                        </span>
                                    </TableHead>
                                    <TableHead>Equipment Name</TableHead>
                                    <TableHead>Date Acquired</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Remarks</TableHead>
                                    <TableHead className="text-center w-40">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-gray-400 py-6">
                                            No inventory data.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pagedData.map(item => (
                                        <TableRow key={item.id} className="hover:bg-blue-50 transition">
                                            {/* Category */}
                                            <TableCell>
                                                {item.category?.category_name || 'N/A'}
                                            </TableCell>
                                            {/* Equipment Name, Serial Number, Office */}
                                            <TableCell>
                                                <div className="font-medium text-gray-900">{item.equipment_name}</div>
                                                <div className="text-xs text-gray-500">
                                                    Serial No: <span className="font-mono">{item.serial_number || 'N/A'}</span>
                                                </div>
                                                <div className="text-xs text-blue-700 mt-1">
                                                    {item.office?.office_name ? (
                                                        <>Located at <span className="font-semibold">{item.office.office_name}</span></>
                                                    ) : (
                                                        <span className="italic text-gray-400">No Office Assigned</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            {/* Date Acquired */}
                                            <TableCell>
                                                {item.date_acquired
                                                    ? new Date(item.date_acquired).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                                    : 'N/A'}
                                            </TableCell>
                                            {/* Notes */}
                                            <TableCell>
                                                {item.notes
                                                    ? <span className="text-gray-700">{item.notes}</span>
                                                    : <span className="italic text-gray-400">No notes</span>
                                                }
                                            </TableCell>
                                            {/* Remarks */}
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
                                                        ${item.remarks === "Non-Functionable"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {item.remarks === "Non-Functionable" ? (
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
                                            {/* Actions */}
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleToggleRemarks(item)}
                                                    className="ml-1"
                                                    style={{ backgroundColor: '#f0f0f0', color: '#333', cursor: 'pointer', transition: 'background-color 0.2s ease', 'borderColor': '#ccc', 'borderWidth': '1px',
                                                        'borderStyle': 'solid', 'borderRadius': '4px', 'padding': '0.25rem 0.5rem', 'fontSize': '0.875rem', 'fontWeight': '500', 'display': 'inline-flex', 'alignItems': 'center', 'gap': '0.25rem',
                                                        'textDecoration': 'none', ':hover': { backgroundColor: '#e0e0e0' }
                                                        }}
                                                >
                                                    {item.remarks === "Non-Functionable" ? (
                                                        <>
                                                            <BadgeCheck className="w-4 h-4 mr-1" />

                                                            Mark as Function
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ban className="w-4 h-4 mr-1" />
                                                            Mark as Non Function
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(item)}
                                                    style={{ backgroundColor: '#f0f0f0', color: '#333' }}
                                                >
                                                    <PenIcon className="w-4 h-4 mr-1" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id!)}
                                                >
                                                    <Trash2Icon className="w-4 h-4 mr-1" />
                                                </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        {/* Paging Controls */}
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalFilteredPages || 1}
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
                                    disabled={currentPage === totalFilteredPages || totalFilteredPages === 0}
                                    onClick={() => setCurrentPage(p => Math.min(totalFilteredPages, p + 1))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal for Add/Edit */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => { setShowModal(false); setEditId(null); setForm({}); }}
                                type="button"
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Item" : "Add Item"}</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        className="border px-2 py-1 rounded w-full"
                                        value={form.category_id || ""}
                                        onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Office</label>
                                    <select
                                        className="border px-2 py-1 rounded w-full"
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
                                    <label className="block text-sm font-medium mb-1">Equipment Name</label>
                                    <Input
                                        value={form.equipment_name || ""}
                                        onChange={e => setForm({ ...form, equipment_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Serial Number</label>
                                    <Input
                                        value={form.serial_number || ""}
                                        onChange={e => setForm({ ...form, serial_number: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date Acquired</label>
                                    <Input
                                        type="date"
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
                                        onClick={() => { setShowModal(false); setEditId(null); setForm({}); }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">{editId ? "Update" : "Add"}</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Delete Alert */}
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
                        duration={3000} // notification will auto-close after 3 seconds
                    />
                )}
            </AppLayout>
        );
    }
