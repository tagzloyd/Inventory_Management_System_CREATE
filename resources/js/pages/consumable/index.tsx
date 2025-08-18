import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type BreadcrumbItem } from '@/types'
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inventory Management', href: '/dashboard' },
  { title: 'Consumable', href: '/consumable' },
]

type ConsumableStatus = 'Available' | 'Low Stock' | 'Out of Stock'

interface ConsumableItem {
  id: number
  item_name: string
  description?: string
  quantity: number
  status: ConsumableStatus
}

const DEFAULT_CONSUMABLE_ITEM = {
  item_name: '',
  description: '',
  quantity: 0,
  status: 'Available' as ConsumableStatus
}

export default function Consumable() {
  const [consumableItems, setConsumableItems] = useState<ConsumableItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  
  // Dialog states
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Item states
  const [currentItem, setCurrentItem] = useState<ConsumableItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [formData, setFormData] = useState<Omit<ConsumableItem, 'id'>>(DEFAULT_CONSUMABLE_ITEM)

  // Memoized fetch function with error handling
  const fetchConsumableItems = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get<ConsumableItem[]>('/api/consumable/fetch')
      setConsumableItems(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching consumable items:', err)
      setError('Failed to load consumable items. Please try again later.')
      toast.error('Could not load inventory data', {
        description: axios.isAxiosError(err) 
          ? err.response?.data?.message || 'Network error occurred'
          : 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial data load
  useEffect(() => {
    fetchConsumableItems()
  }, [fetchConsumableItems])

  const openAddDialog = () => {
  setFormData(DEFAULT_CONSUMABLE_ITEM)
  setAddDialogOpen(true)
}

const openUpdateDialog = (item: ConsumableItem) => {
  setCurrentItem(item)
  setFormData({
    item_name: item.item_name,
    description: item.description || '',
    quantity: item.quantity,
    status: item.status
  })
  setUpdateDialogOpen(true)
}

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: name === 'quantity' ? parseInt(value) || 0 : value
  }))
}

const handleStatusChange = (value: ConsumableStatus) => {
  setFormData(prev => ({
    ...prev,
    status: value
  }))
}

const openDeleteDialog = (id: number) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

const handleAdd = async () => {
  if (!formData.item_name.trim()) {
    toast.error('Validation Error', {
      description: 'Item name is required'
    })
    return
  }

  setProcessing(-1)
  try {
    await axios.post('/api/consumable/store', formData)
    toast.success('Item added successfully')
    setAddDialogOpen(false)
    setFormData(DEFAULT_CONSUMABLE_ITEM)
    await fetchConsumableItems() // Refresh the list
  } catch (err) {
    console.error('Error adding item:', err)
    toast.error('Failed to add item', {
      description: axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Validation error'
        : 'An unexpected error occurred'
    })
  } finally {
    setProcessing(null)
  }
}

const handleUpdate = async () => {
  if (!currentItem || !formData.item_name.trim()) {
    toast.error('Validation Error', {
      description: 'Item name is required'
    })
    return
  }

  setProcessing(currentItem.id)
  try {
    await axios.put(`/api/consumable/${currentItem.id}`, formData)
    toast.success('Item updated successfully')
    setUpdateDialogOpen(false)
    setCurrentItem(null)
    await fetchConsumableItems() // Refresh the list
  } catch (err) {
    console.error('Error updating item:', err)
    toast.error('Update failed', {
      description: axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Validation error'
        : 'Failed to update item'
    })
  } finally {
    setProcessing(null)
  }
}

const handleDelete = async () => {
  if (!itemToDelete) return

  setProcessing(itemToDelete)
  try {
    await axios.delete(`/api/consumable/${itemToDelete}`)
    toast.success('Item deleted successfully')
    setDeleteDialogOpen(false)
    await fetchConsumableItems() // Refresh the list
  } catch (err) {
    console.error('Error deleting item:', err)
    toast.error('Deletion failed', {
      description: axios.isAxiosError(err) 
        ? err.response?.data?.message || 'Item may be in use elsewhere'
        : 'Failed to delete item'
    })
  } finally {
    setProcessing(null)
    setItemToDelete(null)
  }
}

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Consumable Items" />

      <div className="space-y-6 p-4 sm:p-6">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Consumable Items Management
              </CardTitle>
              <CardDescription className="mt-1">
                Manage and track your consumable items efficiently.
              </CardDescription>
            </div>

            <Button 
              className="rounded-xl shadow-md hover:shadow-lg transition-shadow"
              onClick={openAddDialog}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>

          <Card className="mt-6 overflow-hidden border shadow-sm rounded-2xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      colSpan={5}
                      className="border-b bg-gray-50/95 text-center text-lg font-semibold"
                    >
                      Consumable Inventory
                    </TableHead>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[200px]">Name of Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading inventory...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : consumableItems.length > 0 ? (
                    consumableItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/80">
                        <TableCell className="border font-medium">{item.item_name}</TableCell>
                        <TableCell className="border text-ellipsis max-w-[200px] truncate">
                          {item.description}
                        </TableCell>
                        <TableCell className="border text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="border text-center">
                          <Badge
                            variant="outline"
                            className={
                              item.status === 'Available'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : item.status === 'Low Stock'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="border">
                          <div className="flex justify-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openUpdateDialog(item)}
                              disabled={processing === item.id}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => openDeleteDialog(item.id)}
                              disabled={processing === item.id}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        {error || 'No consumable items found. Add your first item to get started.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog 
        open={addDialogOpen || updateDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            addDialogOpen ? setAddDialogOpen(false) : setUpdateDialogOpen(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {addDialogOpen ? 'Add New' : 'Edit'} Consumable Item
            </DialogTitle>
            <DialogDescription>
              {addDialogOpen 
                ? 'Fill in the details of the new consumable item.'
                : 'Update the details of this consumable item.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item_name" className="text-right">
                Item Name
              </Label>
              <Input
                id="item_name"
                name="item_name"
                value={formData.item_name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter item name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                className="col-span-3"
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => addDialogOpen ? setAddDialogOpen(false) : setUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={addDialogOpen ? handleAdd : handleUpdate}
              disabled={!formData.item_name.trim() || 
                (addDialogOpen ? processing === -1 : processing === currentItem?.id)}
            >
              {(addDialogOpen ? processing === -1 : processing === currentItem?.id) ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {addDialogOpen ? 'Add Item' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the consumable item from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={processing === itemToDelete}
              className="bg-destructive text-outline-foreground hover:bg-destructive/90"
            >
              {processing === itemToDelete ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}