import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from "@tanstack/react-table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, FolderKanban, ArrowUpDown, Pencil, Trash2, Plus, Loader2, MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inventory Management', href: '/dashboard' },
  { title: 'Categories & Offices', href: '/categories' },
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
  const [offices, setOffices] = useState<Office[]>([]);
  const [name, setName] = useState('');
  const [officeName, setOfficeName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'offices'>('categories');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, officesRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/offices')
        ]);
        
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.data || []);
        setOffices(Array.isArray(officesRes.data) ? officesRes.data : officesRes.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch data', err);
        toast.error('Failed to fetch data', {
          description: 'Please try again later',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        if (activeTab === 'categories') {
          await axios.put(`/api/categories/${editId}`, { name });
          toast.success('Category updated successfully!');
        } else {
          await axios.put(`/api/offices/${editId}`, { office_name: officeName });
          toast.success('Office updated successfully!');
        }
      } else {
        if (activeTab === 'categories') {
          await axios.post('/api/categories', { name });
          toast.success('Category added successfully!');
        } else {
          await axios.post('/api/offices', { office_name: officeName });
          toast.success('Office added successfully!');
        }
      }
      setName('');
      setOfficeName('');
      setEditId(null);
      setIsModalOpen(false);
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', {
        description: 'Please check your input and try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      setIsSubmitting(true);
      try {
        if (activeTab === 'categories') {
          await axios.delete(`/api/categories/${deleteId}`);
          toast.success('Category deleted successfully!');
        } else {
          await axios.delete(`/api/offices/${deleteId}`);
          toast.success('Office deleted successfully!');
        }
        refreshData();
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete', {
          description: 'This item might be in use and cannot be deleted',
        });
      } finally {
        setIsSubmitting(false);
        setDeleteId(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'categories') {
        const res = await axios.get('/api/categories');
        setCategories(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } else {
        const res = await axios.get('/api/offices');
        setOffices(Array.isArray(res.data) ? res.data : res.data?.data || []);
      }
    } catch (err) {
      console.error('Failed to refresh data', err);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const categoryColumns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 hover:bg-transparent"
          >
            Category Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="bg-green-50 p-2 rounded-lg">
            <FolderKanban className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      )
    },
    {
      accessorKey: "inventories_count",
      header: "Items",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-sm">
          {row.getValue("inventories_count")} items
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setEditId(category.id);
                    setName(category.name);
                    setIsEditing(true);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => {
                    setDeleteId(category.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ];

  const officeColumns: ColumnDef<Office>[] = [
    {
      accessorKey: "office_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 hover:bg-transparent"
          >
            Office Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium">{row.getValue("office_name")}</span>
        </div>
      )
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const office = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setEditId(office.id);
                    setOfficeName(office.office_name);
                    setIsEditing(true);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => {
                    setDeleteId(office.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories and Offices" />
      <div className="p-4 sm:p-6 space-y-6">
        <div className="space-y-1">
          <div>
                <CardTitle className="text-2xl font-semibold tracking-tight">Categories and Offices Management</CardTitle>
                <CardDescription className="mt-1">
                  Manage your inventory categories and office locations
                </CardDescription>
              </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'categories' | 'offices')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="categories" className="gap-2">
              <FolderKanban className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="offices" className="gap-2">
              <Building2 className="w-4 h-4" />
              Offices
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${
                  activeTab === 'categories' 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  {activeTab === 'categories' ? (
                    <FolderKanban className="w-5 h-5" />
                  ) : (
                    <Building2 className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {activeTab === 'categories' ? 'Equipment Categories' : 'Office Locations'}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {activeTab === 'categories' 
                      ? 'Manage your inventory categories' 
                      : 'Manage office locations for inventory assignment'}
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                className="gap-1"
                onClick={() => {
                  setName('');
                  setOfficeName('');
                  setEditId(null);
                  setIsEditing(false);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add {activeTab === 'categories' ? 'Category' : 'Office'}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="p-2">
                {activeTab === 'categories' ? (
                  <DataTable 
                    columns={categoryColumns}
                    data={categories}
                    searchKey="name"
                    emptyState={
                      <div className="p-6 text-center">
                        <FolderKanban className="mx-auto h-10 w-10 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium">No categories found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Get started by adding a new category
                        </p>
                        <Button
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            setName('');
                            setEditId(null);
                            setIsEditing(false);
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Category
                        </Button>
                      </div>
                    }
                  />
                ) : (
                  <DataTable
                    columns={officeColumns}
                    data={offices}
                    searchKey="office_name"
                    emptyState={
                      <div className="p-6 text-center">
                        <Building2 className="mx-auto h-10 w-10 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium">No offices found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Get started by adding a new office
                        </p>
                        <Button
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            setOfficeName('');
                            setEditId(null);
                            setIsEditing(false);
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Office
                        </Button>
                      </div>
                    }
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Combined Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${
                activeTab === 'categories' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-blue-50 text-blue-600'
              }`}>
                {activeTab === 'categories' ? (
                  <FolderKanban className="w-5 h-5" />
                ) : (
                  <Building2 className="w-5 h-5" />
                )}
              </div>
              <DialogTitle className="text-lg">
                {isEditing 
                  ? `Edit ${activeTab === 'categories' ? 'Category' : 'Office'}` 
                  : `Add ${activeTab === 'categories' ? 'Category' : 'Office'}`}
              </DialogTitle>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  {activeTab === 'categories' ? 'Category Name' : 'Office Name'}
                </label>
                <Input
                  id="name"
                  value={activeTab === 'categories' ? name : officeName}
                  onChange={(e) => 
                    activeTab === 'categories' 
                      ? setName(e.target.value) 
                      : setOfficeName(e.target.value)
                  }
                  className="text-sm"
                  placeholder={`Enter ${activeTab === 'categories' ? 'category' : 'office'} name`}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add'} {activeTab === 'categories' ? 'Category' : 'Office'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg">
                Confirm Deletion
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm mt-2">
              Are you sure you want to delete this {activeTab === 'categories' ? 'category' : 'office'}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}