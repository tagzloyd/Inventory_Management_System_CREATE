import { useEffect, useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, Loader2, Check, X } from "lucide-react";

// Notification component
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
    { title: 'Faculty', href: '/faculty' },
];

type Faculty = {
    id: number;
    name: string;
    office_id: number;
    email?: string;
    phone?: string;
    office?: {
        id: number;
        office_name: string;
    };
};

export default function FacultyIndex() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [form, setForm] = useState<Partial<Faculty>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [offices, setOffices] = useState<{ id: number; office_name: string }[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Fetch data
    const fetchFaculties = async () => {
        try {
            const res = await axios.get('/api/faculties');
            setFaculties(res.data);
            setLoading(false);
        } catch (err) {
            setNotification({ message: "Failed to load faculties", type: "error" });
            setLoading(false);
        }
    };

    const fetchOffices = async () => {
        const res = await axios.get('/api/offices');
        setOffices(res.data);
    };

    useEffect(() => {
        fetchFaculties();
        fetchOffices();
    }, []);

    // Form handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/api/faculties/${editId}`, form);
                setNotification({ message: "Faculty updated successfully!", type: "success" });
            } else {
                await axios.post('/api/faculties/store', form);
                setNotification({ message: "Faculty added successfully!", type: "success" });
            }
            setForm({});
            setEditId(null);
            setShowModal(false);
            fetchFaculties();
        } catch (err) {
            setNotification({ 
                message: "Failed to save faculty. Please check your data.", 
                type: "error" 
            });
        }
    };

    const handleEdit = (faculty: Faculty) => {
        setEditId(faculty.id);
        setForm({
            name: faculty.name,
            office_id: faculty.office_id,
            email: faculty.email,
            phone: faculty.phone,
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                await axios.delete(`/api/faculties/${deleteId}`);
                setNotification({ message: "Faculty deleted successfully!", type: "success" });
                fetchFaculties();
            } catch (err) {
                setNotification({ message: "Failed to delete faculty.", type: "error" });
            }
            setDeleteId(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty" />
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Faculty Management</h1>
                    <Button onClick={() => { setShowModal(true); setEditId(null); setForm({}); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Faculty
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow border p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Office</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faculties.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                                            No faculty data available
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    faculties.map(faculty => (
                                        <TableRow key={faculty.id}>
                                            <TableCell className="font-medium">{faculty.name}</TableCell>
                                            <TableCell>{faculty.office?.office_name || 'N/A'}</TableCell>
                                            <TableCell>{faculty.email || 'N/A'}</TableCell>
                                            <TableCell>{faculty.phone || 'N/A'}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(faculty)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(faculty.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => { setShowModal(false); setEditId(null); setForm({}); }}
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-semibold mb-4">
                                {editId ? "Edit Faculty" : "Add Faculty"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Faculty Name</label>
                                    <Input
                                        value={form.name || ""}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Office</label>
                                    <select
                                        className="border rounded-md px-3 py-2 w-full"
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
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <Input
                                        type="email"
                                        value={form.email || ""}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <Input
                                        value={form.phone || ""}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => { setShowModal(false); setEditId(null); setForm({}); }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editId ? "Update" : "Add"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation */}
                {deleteId !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                            <p className="mb-6">Are you sure you want to delete this faculty member?</p>
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
                    />
                )}
            </div>
        </AppLayout>
    );
}