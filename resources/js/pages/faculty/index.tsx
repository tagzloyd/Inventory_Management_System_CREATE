import { useEffect, useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, Loader2, Mail, Phone, Building2, Package2, Check, Ban, User, Search, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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
        remarks?: string;
    }[];
};

export default function FacultyIndex() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [form, setForm] = useState<Partial<Faculty>>({});
    const [editId, setEditId] = useState<number | null>(null);
    const [offices, setOffices] = useState<{ id: number; office_name: string }[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedFaculty, setExpandedFaculty] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fetchFaculties = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/faculties');
            setFaculties(res.data);
        } catch (err) {
            toast.error("Failed to load faculties", {
                description: "Please try again later",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchOffices = async () => {
        try {
            const res = await axios.get('/api/offices');
            setOffices(res.data);
        } catch (err) {
            toast.error("Failed to load offices", {
                description: "Office data might be incomplete",
            });
        }
    };

    useEffect(() => {
        fetchFaculties();
        fetchOffices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editId) {
                await axios.put(`/api/faculties/${editId}`, form);
                toast.success("Faculty updated successfully!", {
                    description: `${form.name}'s details have been updated.`,
                });
            } else {
                await axios.post('/api/faculties/store', form);
                toast.success("Faculty added successfully!", {
                    description: `${form.name} has been added to the system.`,
                });
            }
            setForm({});
            setEditId(null);
            setShowModal(false);
            fetchFaculties();
        } catch (err) {
            toast.error("Failed to save faculty", {
                description: "Please check your data and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (faculty: Faculty) => {
        if (faculty.name.includes("Others")) return;
        
        setEditId(faculty.id);
        setForm({
            name: faculty.name,
            office_id: faculty.office_id,
            email: faculty.email,
            phone: faculty.phone,
        });
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            const faculty = faculties.find(f => f.id === deleteId);
            if (faculty?.name.includes("Others")) return;
            
            setIsSubmitting(true);
            try {
                await axios.delete(`/api/faculties/${deleteId}`);
                toast.success("Faculty deleted successfully!", {
                    description: `${faculty?.name} has been removed from the system.`,
                });
                fetchFaculties();
            } catch (err) {
                toast.error("Failed to delete faculty", {
                    description: "This faculty might have assigned equipment.",
                });
            } finally {
                setIsSubmitting(false);
                setDeleteId(null);
            }
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedFaculty(expandedFaculty === id ? null : id);
    };

    const filteredFaculties = faculties.filter(faculty =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (faculty.office?.office_name && !faculty.name.includes("Others") && faculty.office.office_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (faculty.email && !faculty.name.includes("Others") && faculty.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (faculty.phone && !faculty.name.includes("Others") && faculty.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty Management" />
            <Toaster richColors position="top-right" />
            
            <div className="space-y-6 m-6 " >
                <div className="space-y-1">
                    <div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">Faculty Management</CardTitle>
                        <CardDescription className="mt-1">
                        Maintain a directory of faculty members who can access and use inventory items.
                        </CardDescription>
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search faculty..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button 
                                onClick={() => { setShowModal(true); setEditId(null); setForm({}); }}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" /> 
                                Add Faculty
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-4 w-[150px]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[30%]">Faculty Member</TableHead>
                                            <TableHead className="w-[25%]">Office</TableHead>
                                            <TableHead className="w-[25%]">Contact</TableHead>
                                            <TableHead className="w-[20%] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredFaculties.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-64">
                                                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                                        <User className="h-10 w-10" />
                                                        <div className="space-y-1">
                                                            <p className="font-medium">No faculty members found</p>
                                                            <p className="text-sm">Try adjusting your search or add a new faculty member</p>
                                                        </div>
                                                        <Button 
                                                            variant="outline"
                                                            onClick={() => { 
                                                                setShowModal(true); 
                                                                setEditId(null); 
                                                                setForm({}); 
                                                            }}
                                                            className="gap-2"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                            Add New Faculty
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredFaculties.map(faculty => (
                                                <>
                                                    <TableRow key={`${faculty.id}-main`} className="hover:bg-muted/50">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn(
                                                                    "p-2 rounded-lg",
                                                                    faculty.name.includes("Others") 
                                                                        ? "bg-gray-100" 
                                                                        : "bg-blue-50"
                                                                )}>
                                                                    <User className={cn(
                                                                        "h-5 w-5",
                                                                        faculty.name.includes("Others") 
                                                                            ? "text-gray-600" 
                                                                            : "text-blue-600"
                                                                    )} />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {faculty.name}
                                                                        {faculty.name.includes("Others") && (
                                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                                (Unassigned Equipment)
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {faculty.inventory && faculty.inventory.length > 0 && (
                                                                        <div className="text-xs text-muted-foreground mt-1">
                                                                            {faculty.inventory.length} assigned equipment
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {faculty.name.includes("Others") ? (
                                                                <div className="text-muted-foreground">No official office</div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                                    <span>{faculty.office?.office_name || 'Not assigned'}</span>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {faculty.name.includes("Others") ? (
                                                                <div className="text-muted-foreground">N/A</div>
                                                            ) : (
                                                                <div className="flex flex-col gap-1">
                                                                    {faculty.email ? (
                                                                        <a 
                                                                            href={`mailto:${faculty.email}`}
                                                                            className="flex items-center gap-2 hover:text-primary hover:underline"
                                                                        >
                                                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                                                            {faculty.email}
                                                                        </a>
                                                                    ) : (
                                                                        <div className="text-muted-foreground">No email</div>
                                                                    )}
                                                                    {faculty.phone ? (
                                                                        <a 
                                                                            href={`tel:${faculty.phone}`}
                                                                            className="flex items-center gap-2 hover:text-primary hover:underline"
                                                                        >
                                                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                                                            {faculty.phone}
                                                                        </a>
                                                                    ) : (
                                                                        <div className="text-muted-foreground">No phone</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right space-x-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleExpand(faculty.id)}
                                                                className="h-8 w-8 p-0"
                                                                title="View equipment"
                                                            >
                                                                {expandedFaculty === faculty.id ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            {!faculty.name.includes("Others") && (
                                                                <>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleEdit(faculty)}
                                                                        className="h-8 w-8 p-0"
                                                                        title="Edit"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setDeleteId(faculty.id)}
                                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                    {expandedFaculty === faculty.id && (
                                                        <TableRow key={`${faculty.id}-expanded`}>
                                                            <TableCell colSpan={4} className="p-0 bg-muted/10">
                                                                <div className="p-4">
                                                                    <div className="space-y-4">
                                                                        <h3 className="font-medium flex items-center gap-2">
                                                                            <Package2 className="h-4 w-4" />
                                                                            Assigned Equipment ({faculty.inventory?.length || 0})
                                                                        </h3>
                                                                        {faculty.inventory && faculty.inventory.length > 0 ? (
                                                                            <div className="border rounded-lg overflow-hidden">
                                                                                <div className="grid grid-cols-12 gap-4 p-4 font-medium bg-muted">
                                                                                    <div className="col-span-5">Equipment</div>
                                                                                    <div className="col-span-3">Serial Number</div>
                                                                                    <div className="col-span-2">Acquired</div>
                                                                                    <div className="col-span-2">Status</div>
                                                                                </div>
                                                                                {faculty.inventory.map(item => (
                                                                                    <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-t hover:bg-muted/50">
                                                                                        <div className="col-span-5 font-medium">{item.equipment_name}</div>
                                                                                        <div className="col-span-3 text-muted-foreground">{item.serial_number || 'N/A'}</div>
                                                                                        <div className="col-span-2 text-muted-foreground">
                                                                                            {item.date_acquired ? new Date(item.date_acquired).toLocaleDateString() : 'N/A'}
                                                                                        </div>
                                                                                        <div className="col-span-2">
                                                                                            <Badge
                                                                                                variant={
                                                                                                    item.remarks === "Non-Functional" 
                                                                                                    ? "destructive" 
                                                                                                    : item.remarks === "Under Repair"
                                                                                                        ? "outline"
                                                                                                        : item.remarks === "Defective"
                                                                                                        ? "destructive"
                                                                                                        : "default"
                                                                                                }
                                                                                                className="gap-1"
                                                                                                >
                                                                                                {item.remarks === "Non-Functional" ? (
                                                                                                    <Ban className="h-3 w-3" />
                                                                                                ) : item.remarks === "Under Repair" ? (
                                                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                                                ) : item.remarks === "Defective" ? (
                                                                                                    <AlertCircle className="h-3 w-3" />
                                                                                                ) : (
                                                                                                    <Check className="h-3 w-3" />
                                                                                                )}
                                                                                                {item.remarks || "Functional"}
                                                                                                </Badge>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
                                                                                <Package2 className="h-8 w-8" />
                                                                                <p>No equipment assigned</p>
                                                                            </div>
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
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                {editId ? (
                                    <Pencil className="h-5 w-5 text-blue-600" />
                                ) : (
                                    <Plus className="h-5 w-5 text-blue-600" />
                                )}
                            </div>
                            <div>
                                <DialogTitle>
                                    {editId ? "Edit Faculty" : "Add Faculty"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editId ? "Update faculty details below" : "Enter details for new faculty member"}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Full Name *</label>
                            <Input
                                value={form.name || ""}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Enter faculty name"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Office *</label>
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
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                {office.office_name}
                                            </div>
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
                                    placeholder="faculty@example.com"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Phone</label>
                                <Input
                                    value={form.phone || ""}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
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
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editId ? "Save Changes" : "Add Faculty"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="bg-red-50 p-2 rounded-lg">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                    This will permanently remove the faculty member and cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Faculty
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}