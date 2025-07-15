import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from "@tanstack/react-table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, FolderKanban, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
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
        toast('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        if (activeTab === 'categories') {
          await axios.put(`/api/categories/${editId}`, { name });
          toast('Catergory updated succcessfully!');
        } else {
          await axios.put(`/api/offices/${editId}`, { office_name: officeName });
          toast('Office updated succcessfully!');
        }
      } else {
        if (activeTab === 'categories') {
          await axios.post('/api/categories', { name });
          toast('Catergory added succcessfully!');
        } else {
          await axios.post('/api/offices', { office_name: officeName });
          toast('Office added succcessfully!');
        }
      }
      setName('');
      setOfficeName('');
      setEditId(null);
      setIsModalOpen(false);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        if (activeTab === 'categories') {
          await axios.delete(`/api/categories/${deleteId}`);
          toast('Category deleted successfully!');
        } else {
          await axios.delete(`/api/offices/${deleteId}`);
          toast(' deleted successfully!');
        }
        refreshData();
      } catch (err) {
        console.error(err);
      }
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const categoryColumns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => <span className="text-sm">{row.getValue("name")}</span>
    },
    {
      accessorKey: "inventories_count",
      header: "Items",
      cell: ({ row }) => (
        <span className=" text-sm text-left block">
          {row.getValue("inventories_count")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={() => {
                setEditId(category.id);
                setName(category.name);
                setIsEditing(true);
                setIsModalOpen(true);
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-2"
              onClick={() => {
                setDeleteId(category.id);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
  ];

  const officeColumns: ColumnDef<Office>[] = [
    {
      accessorKey: "office_name",
      header: "Office Name",
      cell: ({ row }) => <span className="text-sm">{row.getValue("office_name")}</span>
    },
    {
      accessorKey: "inventories_count",
      header: "Items",
      cell: ({ row }) => (
        <span>
          {row.getValue("inventories_count")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const office = row.original;
        return (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={() => {
                setEditId(office.id);
                setOfficeName(office.office_name);
                setIsEditing(true);
                setIsModalOpen(true);
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-2"
              onClick={() => {
                setDeleteId(office.id);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories and Offices" />
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold mb-1">Categories and Offices Management</h1>
          <p className="text-sm text-gray-600">
            Manage your inventory categories and office locations
          </p>
        </div>
        
        <div className="mb-4">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'categories' | 'offices')}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="categories" className="text-sm py-1">
                <FolderKanban className="w-3 h-3 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="offices" className="text-sm py-1">
                <Building2 className="w-3 h-3 mr-2" />
                Offices
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`rounded-full p-2 ${
                activeTab === 'categories' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-blue-50 text-blue-600'
              }`}>
                {activeTab === 'categories' ? (
                  <FolderKanban className="w-4 h-4" />
                ) : (
                  <Building2 className="w-4 h-4" />
                )}
              </span>
              <h2 className="text-sm font-medium">
                {activeTab === 'categories' ? 'Equipment Categories' : 'Office Locations'}
              </h2>
            </div>
            <Button
              size="sm"
              className="h-8 text-sm"
              onClick={() => {
                setName('');
                setOfficeName('');
                setEditId(null);
                setIsEditing(false);
                setIsModalOpen(true);
              }}
            >
              + Add {activeTab === 'categories' ? 'Category' : 'Office'}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="p-10 text-center text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="p-1">
              {activeTab === 'categories' ? (
                <DataTable 
                  columns={categoryColumns}
                  data={categories}
                  searchKey="name"
                />
              ) : (
                <DataTable
                  columns={officeColumns}
                  data={offices}
                  searchKey="office_name"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Combined Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-base">
              {isEditing 
                ? `Edit ${activeTab === 'categories' ? 'Category' : 'Office'}` 
                : `Add ${activeTab === 'categories' ? 'Category' : 'Office'}`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm text-gray-600">
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
              <Button type="submit" className="text-sm">
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
            <AlertDialogTitle className="text-base">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete this {activeTab === 'categories' ? 'category' : 'office'}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="text-sm bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}