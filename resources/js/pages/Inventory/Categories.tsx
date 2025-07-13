import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, FolderKanban } from "lucide-react"; // shadcn/lucide icons

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: '/categories' },
];

type Category = {
    id: number;
    name: string;
    inventories_count: number;
};

type Office = {
    id: number;
    office_name: string;
    inventories_count: number;
};

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setCategoryName] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            } else if (Array.isArray(res.data.data)) {
                setCategories(res.data.data);
            } else {
                setCategories([]);
            }
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/api/categories/${editId}`, { name });
            } else {
                await axios.post('/api/categories', { name });
            }
            setCategoryName('');
            setEditId(null);
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                await axios.delete(`/api/categories/${deleteId}`);
                fetchCategories();
            } catch (err) {
                console.error(err);
            }
            setDeleteId(null);
        }
    };

    const handleEdit = (cat: Category) => {
        setEditId(cat.id);
        setCategoryName(cat.name);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/api/categories/${editId}`, { name });
                setEditId(null);
                setCategoryName('');
                setShowEditModal(false);
                fetchCategories();
            }
        } catch (err) {
            console.error(err);
        }
    };

    function OfficesSection() {
        const [offices, setOffices] = useState<Office[]>([]);
        const [officeName, setOfficeName] = useState('');
        const [editId, setEditId] = useState<number | null>(null);
        const [showModal, setShowModal] = useState(false);
        const [showEditModal, setShowEditModal] = useState(false);
        const [deleteId, setDeleteId] = useState<number | null>(null);

        useEffect(() => {
            fetchOffices();
        }, []);

        const fetchOffices = async () => {
            try {
                const res = await axios.get('/api/offices');
                if (Array.isArray(res.data)) {
                    setOffices(res.data);
                } else if (Array.isArray(res.data.data)) {
                    setOffices(res.data.data);
                } else {
                    setOffices([]);
                }
            } catch (err) {
                console.error('Failed to fetch offices', err);
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                if (editId) {
                    await axios.put(`/api/offices/${editId}`, { office_name: officeName });
                } else {
                    await axios.post('/api/offices', { office_name: officeName });
                }
                setOfficeName('');
                setEditId(null);
                fetchOffices();
                setShowModal(false);
                setShowEditModal(false);
            } catch (err) {
                console.error(err);
            }
        };

        const handleDelete = async (id: number) => {
            setDeleteId(id);
        };

        const confirmDelete = async () => {
            if (deleteId !== null) {
                try {
                    await axios.delete(`/api/offices/${deleteId}`);
                    fetchOffices();
                } catch (err) {
                    console.error(err);
                }
                setDeleteId(null);
            }
        };

        const handleEdit = (office: Office) => {
            setEditId(office.id);
            setOfficeName(office.office_name);
            setShowEditModal(true);
        };

        return (
            <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 rounded-full p-2">
                            <Building2 className="w-5 h-5" />
                        </span>
                        <h2 className="text-lg font-semibold">Location</h2>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="p-1 h-6 w-6 rounded-full flex items-center justify-center"
                        onClick={() => { setShowModal(true); setOfficeName(''); setEditId(null); }}
                        title="Add Office"
                        type="button"
                    >
                        <span className="text-xl font-bold leading-none">+</span>
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">ID</TableHead>
                                <TableHead>Office</TableHead>
                                <TableHead className="text-center">Total no. of Equipment</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-400 py-6">
                                        No offices found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                offices.map((office, idx) => (
                                    <TableRow
                                        key={office.id}
                                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-blue-50 transition"}
                                    >
                                        <TableCell>{office.id}</TableCell>
                                        <TableCell>{office.office_name}</TableCell>
                                        <TableCell className="text-center">{office.inventories_count}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(office)}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(office.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Add Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setShowModal(false)}
                                type="button"
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-semibold mb-4">Add Office</h2>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                            >
                                <Input
                                    value={officeName}
                                    onChange={e => setOfficeName(e.target.value)}
                                    placeholder="Office name"
                                    required
                                />
                                <Button type="submit" className="w-full">Add</Button>
                            </form>
                        </div>
                    </div>
                )}
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setShowEditModal(false)}
                                type="button"
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-semibold mb-4">Edit Office</h2>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                            >
                                <Input
                                    value={officeName}
                                    onChange={e => setOfficeName(e.target.value)}
                                    placeholder="Office name"
                                    required
                                />
                                <Button type="submit" className="w-full">Update</Button>
                            </form>
                        </div>
                    </div>
                )}
                {/* Delete Alert */}
                {deleteId !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                            <h2 className="text-lg font-semibold mb-4">Delete Office</h2>
                            <p className="mb-6">Are you sure you want to delete this office?</p>
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
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-2">Categories and Office Management</h1>
                <p className="mb-6 text-gray-600">
                    Manage your equipment categories and offices here. Add, edit, or remove categories and offices to keep your inventory organized and up-to-date.
                    <br />
                    <span className="text-sm text-blue-700">
                        Tip: Keeping your categories and offices updated helps you track your equipment more efficiently!
                    </span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 rounded-full p-2">
                                    <FolderKanban className="w-5 h-5" />
                                </span>
                                <h2 className="text-lg font-semibold">Category List</h2>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="p-1 h-6 w-6 rounded-full flex items-center justify-center"
                                onClick={() => { setShowModal(true); setCategoryName(''); setEditId(null); }}
                                title="Add Category"
                                type="button"
                            >
                                <span className="text-xl font-bold leading-none">+</span>
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-24">ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-center">Total no. of Equipment</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-400 py-6">
                                                No categories found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        categories.map((cat, idx) => (
                                            <TableRow
                                                key={cat.id}
                                                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-green-50 transition"}
                                            >
                                                <TableCell>{cat.id}</TableCell>
                                                <TableCell>{cat.name}</TableCell>
                                                <TableCell className="text-center">{cat.inventories_count}</TableCell>
                                                <TableCell className="text-center space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(cat)}>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(cat.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <OfficesSection />
                </div>
            </div>
            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                            onClick={() => setShowModal(false)}
                            type="button"
                        >
                            ×
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Add Category</h2>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                await handleSubmit(e);
                                setShowModal(false);
                            }}
                            className="flex flex-col gap-4"
                        >
                            <Input
                                value={name}
                                onChange={e => setCategoryName(e.target.value)}
                                placeholder="Category name"
                                required
                            />
                            <Button type="submit" className="w-full">Add</Button>
                        </form>
                    </div>
                </div>
            )}
            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                            onClick={() => setShowEditModal(false)}
                            type="button"
                        >
                            ×
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
                        <form
                            onSubmit={handleEditSubmit}
                            className="flex flex-col gap-4"
                        >
                            <Input
                                value={name}
                                onChange={e => setCategoryName(e.target.value)}
                                placeholder="Category name"
                                required
                            />
                            <Button type="submit" className="w-full">Update</Button>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Alert */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                        <h2 className="text-lg font-semibold mb-4">Delete Category</h2>
                        <p className="mb-6">Are you sure you want to delete this category?</p>
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
        </AppLayout>
    );
}