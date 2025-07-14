import { useEffect, useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, Loader2, Mail, Phone, Building2, Package2, Check, Ban } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

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
  { title: 'Faculties', href: '/faculties' },
];

type Faculty = {
    id: number;
    name: string;
    office_id: number;
    email?: string;
    phone?: string;
    update_at: string;
    office?: {
        id: number;
        office_name: string;
    };
    inventory?: {
        id: number;
        equipment_name: string;
        serial_number?: string;
        date_acquired?: string;
        updated_at: string;
    }[];
};

const viewDetails = (inventoryId: number) => {
    router.visit('/inventory', {
        preserveScroll: true
    });
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
    const [expandedFaculty, setExpandedFaculty] = useState<number | null>(null);
    
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
        try {
            const res = await axios.get('/api/offices');
            setOffices(res.data);
        } catch (err) {
            setNotification({ message: "Failed to load offices", type: "error" });
        }
    };

    useEffect(() => {
        fetchFaculties();
        fetchOffices();
    }, []);

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

    const toggleExpand = (id: number) => {
        setExpandedFaculty(expandedFaculty === id ? null : id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty" />
            <Toaster />
            <div className="space-y-2.5">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Faculty Management</CardTitle>
                                <CardDescription>
                                    Maintain a directory of faculty members who can access and use inventory items.
                                </CardDescription>
                            </div>
                            <Button 
                                onClick={() => { setShowModal(true); setEditId(null); setForm({}); }}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" /> Add Faculty
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Office</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {faculties.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                    No faculty members found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            faculties.map(faculty => (
                                                <>
                                                    <TableRow key={faculty.id} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">{faculty.name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                                {faculty.office?.office_name || 'N/A'}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-1">
                                                                {faculty.email && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                                        <span>{faculty.email}</span>
                                                                    </div>
                                                                )}
                                                                {faculty.phone && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                                        <span>{faculty.phone}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right space-x-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleExpand(faculty.id)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                {expandedFaculty === faculty.id ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEdit(faculty)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(faculty.id)}
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    {expandedFaculty === faculty.id && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="p-0">
                                                                <div className="p-4 bg-muted/50">
                                                                    <div className="space-y-4">
                                                                        <h3 className="font-medium flex items-center gap-2">
                                                                            <Package2 className="h-4 w-4" />
                                                                            Assigned Equipment
                                                                        </h3>
                                                                        {faculty.inventory && faculty.inventory.length > 0 ? (
                                                                            <div className="border rounded-md overflow-hidden">
                                                                                <div className="grid grid-cols-4 gap-4 p-4 font-medium bg-muted">
                                                                                    <div>Equipment</div>
                                                                                    <div>Serial No.</div>
                                                                                    <div>Date Acquired</div>
                                                                                    <div>Last Updated</div>
                                                                                </div>
                                                                                {faculty.inventory.map(item => (
                                                                                    <div key={item.id} className="grid grid-cols-4 gap-4 p-4 border-t">
                                                                                        <div className="font-medium">{item.equipment_name}</div>
                                                                                        <div className="text-muted-foreground">{item.serial_number || 'N/A'}</div>
                                                                                        <div className="text-muted-foreground">{item.date_acquired || 'N/A'}</div>
                                                                                        <div className="text-muted-foreground">
                                                                                            {new Date(item.updated_at).toLocaleString()}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-muted-foreground">No equipment assigned to this faculty member</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Add/Edit Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle>{editId ? "Edit Faculty Member" : "Add New Faculty Member"}</DialogTitle>
                            <DialogDescription>
                                {editId ? "Update the faculty details below" : "Enter the details for the new faculty member"}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Full Name</label>
                                <Input
                                    value={form.name || ""}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Office</label>
                                <Select
                                    value={form.office_id?.toString() || ""}
                                    onValueChange={value => setForm({ ...form, office_id: Number(value) })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select office" />
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
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Email</label>
                                    <Input
                                        type="email"
                                        value={form.email || ""}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Phone Number</label>
                                    <Input
                                        value={form.phone || ""}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            
                            <DialogFooter>
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
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <Dialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this faculty member? This action cannot be undone.
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
            </div>
        </AppLayout>
    );
}