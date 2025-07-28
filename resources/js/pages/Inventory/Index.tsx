import { useEffect, useState } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, FolderKanban, Package2, PenIcon, Trash2Icon, Check, ChevronsUpDown, MoreVertical, Wrench } from "lucide-react";
import { BadgeCheck, Ban } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

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
      "fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-md shadow-lg animate-in slide-in-from-right-8",
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
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get<InventoryItem[]>('/api/inventory');
      setInventoryData(res.data.map(item => ({
        ...item,
        faculty: item.faculty ? { id: item.faculty.id, name: item.faculty.name } : undefined,
        categories: item.categories || []
      })));
    } catch (error) {
      toast.error("Failed to load inventory data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchOffices = async () => {
    try {
      const res = await axios.get('/api/offices');
      setOffices(res.data);
    } catch (error) {
      toast.error("Failed to load offices");
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await axios.get('/api/faculties');
      setFaculties(res.data);
    } catch (error) {
      toast.error("Failed to load faculties");
    }
  };

  useEffect(() => {
    Promise.all([fetchInventory(), fetchCategories(), fetchOffices(), fetchFaculties()]);
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
        toast.success('Item updated successfully!');
      } else {
        await axios.post('/api/inventory', payload);
        toast.success('Item added successfully!');
      }
      setForm({});
      setSelectedCategories([]);
      setEditId(null);
      setShowModal(false);
      fetchInventory();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                      "Failed to save item. Please check your data.";
      toast.error(errorMessage);
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
        toast.success("Item deleted successfully!");
        fetchInventory();
      } catch (err) {
        toast.error("Failed to delete item.");
      }
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (item: InventoryItem, newStatus: string) => {
    try {
      await axios.put(`/api/inventory/${item.id}`, { ...item, remarks: newStatus });
      toast.success(`Item marked as ${newStatus}.`);
      fetchInventory();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredData = inventoryData.filter(item => {
    const searchTerm = search.toLowerCase();
    return (
      item.equipment_name.toLowerCase().includes(searchTerm) ||
      (item.serial_number?.toLowerCase().includes(searchTerm) || false) ||
      (item.notes?.toLowerCase().includes(searchTerm) || false) ||
      (item.date_acquired?.toLowerCase().includes(searchTerm) || false) ||
      (item.remarks?.toLowerCase().includes(searchTerm) || false) ||
      (item.office?.office_name.toLowerCase().includes(searchTerm) || false) ||
      (item.faculty?.name.toLowerCase().includes(searchTerm) || false) ||
      (item.categories?.some(cat => cat.name.toLowerCase().includes(searchTerm)) || false)
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventory" />
      <Toaster position="top-right" richColors />
      <div className="space-y-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="px-7  pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-semibold tracking-tight">Inventory Management</CardTitle>
                <CardDescription className="mt-1">
                  Track and manage all equipment and assets
                </CardDescription>
              </div>
              <Button 
                onClick={() => { 
                  setShowModal(true); 
                  setEditId(null); 
                  setForm({}); 
                  setSelectedCategories([]); 
                }}
                className="gap-2"
              >
                <Package2 className="h-4 w-4" />
                Add New Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <Input
                  placeholder="Search equipment, serial numbers, offices..."
                  value={search}
                  onChange={e => { 
                    setSearch(e.target.value); 
                    setCurrentPage(1); 
                  }}
                  className="w-full sm:w-96"
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">Total items:</span>
                  <Badge variant="outline" className="px-2.5 py-1">
                    {filteredData.length}
                  </Badge>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="w-[180px]">Equipment</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="w-[120px]">Date Acquired</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="text-right w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[30px]" /></TableCell>
                        </TableRow>
                      ))
                    ) : pagedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                          No inventory items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pagedData.map(item => (
                        <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell>
                            <div className="font-medium">{item.equipment_name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.serial_number || 'No serial number'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.categories && item.categories.length > 0 ? (
                                item.categories.map(cat => (
                                  <Badge 
                                    key={cat.id} 
                                    variant="outline" 
                                    className="text-xs font-normal"
                                  >
                                    {cat.name}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {item.office?.office_name && (
                                <>
                                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{item.office.office_name}</span>
                                </>
                              )}
                              {item.faculty?.name && (
                                <span className="text-muted-foreground text-sm">
                                  ({item.faculty.name})
                                </span>
                              )}
                              {!item.office?.office_name && !item.faculty?.name && (
                                <span className="text-muted-foreground text-sm">Unassigned</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.date_acquired ? (
                              <span className="text-sm">
                                {new Date(item.date_acquired).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                item.remarks === "Non-Functional" ? "destructive" :
                                item.remarks === "Defective" ? "secondary" :
                                item.remarks === "Under Repair" ? "outline" : 
                                "default"
                              }
                              className="gap-1.5"
                            >
                              {item.remarks === "Non-Functional" ? (
                                <>
                                  <Ban className="h-3 w-3" />
                                  Non-Functional
                                </>
                              ) : item.remarks === "Defective" ? (
                                <>
                                  <Ban className="h-3 w-3" />
                                  Defective
                                </>
                              ) : item.remarks === "Under Repair" ? (
                                <>
                                  <Wrench className="h-3 w-3" />
                                  Under Repair
                                </>
                              ) : (
                                <>
                                  <BadgeCheck className="h-3 w-3" />
                                  Functional
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => handleEdit(item)}
                                  className="cursor-pointer"
                                >
                                  <PenIcon className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(item, "Functional")}
                                  className="cursor-pointer"
                                >
                                  <BadgeCheck className="mr-2 h-4 w-4" />
                                  Functional
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(item, "Non-Functional")}
                                  className="cursor-pointer"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Non-Functional
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(item, "Defective")}
                                  className="cursor-pointer"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Defective
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(item, "Under Repair")}
                                  className="cursor-pointer"
                                >
                                  <Wrench className="mr-2 h-4 w-4" />
                                  Under Repair
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(item.id!)}
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <Trash2Icon className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex items-center space-x-2">
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
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editId ? "Edit Inventory Item" : "Add New Inventory Item"}
            </DialogTitle>
            <DialogDescription>
              {editId ? "Update the equipment details below" : "Fill in the details for the new equipment"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Equipment Name *</label>
                <Input
                  value={form.equipment_name || ""}
                  onChange={e => setForm({ ...form, equipment_name: e.target.value })}
                  placeholder="Enter equipment name"
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
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        <ScrollArea className="h-60">
                          {categories.map((category) => (
                            <CommandItem
                              key={category.id}
                              onSelect={() => handleCategorySelect(category)}
                              className="cursor-pointer"
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
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge 
                      key={category.id} 
                      variant="secondary"
                      className="flex items-center gap-1 py-1"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className="ml-1 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Location *</label>
                <Select
                  value={form.office_id?.toString() || ""}
                  onValueChange={value => setForm({ ...form, office_id: Number(value) })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-60">
                      {offices.map(office => (
                        <SelectItem key={office.id} value={office.id.toString()}>
                          {office.office_name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Faculty *</label>
                <Select
                  value={form.faculty_id?.toString() || ""}
                  onValueChange={value => setForm({ ...form, faculty_id: Number(value) })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-60">
                      {faculties.map(faculty => (
                        <SelectItem key={faculty.id} value={faculty.id.toString()}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
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
                  placeholder="Enter serial number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Date Acquired</label>
                <Input
                  value={form.date_acquired || ""}
                  onChange={e => setForm({ ...form, date_acquired: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Notes</label>
              <Input
                value={form.notes || ""}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes or description"
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
                  <SelectItem value="Defective">
                    <div className="flex items-center gap-2">
                      <Ban className="h-4 w-4" />
                      Defective
                    </div>
                  </SelectItem>
                  <SelectItem value="Under Repair">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Under Repair
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
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
              <Button type="submit">
                {editId ? "Save Changes" : "Add Equipment"}
              </Button>
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
              This action cannot be undone. Are you sure you want to permanently delete this inventory item?
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
              Delete Permanently
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