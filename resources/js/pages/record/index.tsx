import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Download, FileText, RefreshCw, Search, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table"

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inventory Management', href: '/dashboard' },
  { title: 'Reports', href: '/records' },
];

type InventoryItem = {
  category?: string;
  equipment_name: string;
  serial_number: string;
  date_acquired: string;
  notes?: string;
  remarks?: string;
  maintenance_activities?: string;
  maintenance_schedule?: string;
  office_name?: string;
  faculty_name?: string;
};

type GroupedItem = {
  equipment_name: string;
  number_of_units: number;
  maintenance_activities?: string;
  maintenance_schedule?: string;
};

export default function Records() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('detailed');
  
  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Detailed table columns
  const detailedColumns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("category") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "office_name",
      header: "Office",
      cell: ({ row }) => (
        <div>
          {row.getValue("office_name") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "faculty_name",
      header: "Faculty",
      cell: ({ row }) => (
        <div>
          {row.getValue("faculty_name") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "equipment_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Equipment Name
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <span className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronUp className="absolute" />
                <ChevronDown className="absolute mt-1" />
              </span>
            )}
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("equipment_name")}</div>,
    },
    {
      accessorKey: "serial_number",
      header: "Serial Number",
      cell: ({ row }) => <div>{row.getValue("serial_number")}</div>,
    },
    {
      accessorKey: "date_acquired",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Acquired
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <span className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronUp className="absolute" />
                <ChevronDown className="absolute mt-1" />
              </span>
            )}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div>
          {row.getValue("date_acquired") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ row }) => (
        <div>
          {row.getValue("remarks") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "maintenance_activities",
      header: "Maintenance Activity",
      cell: ({ row }) => (
        <div>
          {row.getValue("maintenance_activities") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "maintenance_schedule",
      header: "Maintenance Schedule",
      cell: ({ row }) => (
        <div>
          {row.getValue("maintenance_schedule") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
  ];

  // Grouped table columns
  const groupedColumns: ColumnDef<GroupedItem>[] = [
    {
      accessorKey: "equipment_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Equipment Name
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <span className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronUp className="absolute" />
                <ChevronDown className="absolute mt-1" />
              </span>
            )}
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("equipment_name")}</div>,
    },
    {
      accessorKey: "maintenance_activities",
      header: "Maintenance Activity",
      cell: ({ row }) => (
        <div>
          {row.getValue("maintenance_activities") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "maintenance_schedule",
      header: "Maintenance Schedule",
      cell: ({ row }) => (
        <div>
          {row.getValue("maintenance_schedule") || <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      accessorKey: "number_of_units",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Units
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <span className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronUp className="absolute" />
                <ChevronDown className="absolute mt-1" />
              </span>
            )}
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-center">{row.getValue("number_of_units")}</div>,
    },
  ];

  // Create tables
  const detailedTable = useReactTable({
    data: inventoryItems,
    columns: detailedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const groupedTable = useReactTable({
    data: groupedItems,
    columns: groupedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await axios.get('/api/records/fetch');
      
      if (res.data.success) {
        setInventoryItems(res.data.all_records || []);
        setGroupedItems(res.data.grouped_records || []);
      } else {
        setError(res.data.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      setError('Failed to connect to server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
  // Enhanced Excel-specific styling with professional design
  const headerStyle = `
    <style>
      /* Main table styling */
      table {
        border-collapse: collapse;
        width: 100%;
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
      
      /* Header styling */
      .report-header {
        background-color: #1e40af; /* bg-blue-800 */
        color: white;
        font-size: 18px;
        font-weight: bold;
        padding: 12px;
        text-align: center;
        border: 1px solid #1e3a8a; /* border-blue-900 */
      }
      
      .university-header {
        background-color: #2563eb; /* bg-blue-600 */
        color: white;
        font-size: 16px;
        font-weight: bold;
        padding: 10px;
        text-align: center;
        border: 1px solid #1d4ed8; /* border-blue-700 */
      }
      
      .subheader {
        background-color: #3b82f6; /* bg-blue-500 */
        color: white;
        font-size: 14px;
        padding: 8px;
        text-align: center;
        border: 1px solid #2563eb; /* border-blue-600 */
      }
      
      /* Column headers */
      th {
        background-color: #1a56db; /* bg-blue-700 */
        color: white;
        font-weight: bold;
        border: 1px solid #1e40af; /* border-blue-800 */
        padding: 8px;
        text-align: left;
        font-size: 11px;
        text-transform: uppercase;
      }
      
      /* Data cells */
      td {
        border: 1px solid #d1d5db; /* border-gray-300 */
        padding: 6px 8px;
        vertical-align: top;
        font-size: 11px;
      }
      
      /* Alternating row colors */
      .alt-row {
        background-color: #f9fafb; /* bg-gray-50 */
      }
      
      /* Special cell styling */
      .category-cell {
        color: #1d4ed8; /* text-blue-700 */
        font-weight: 500;
      }
      
      .serial-cell {
        font-family: 'Courier New', monospace;
        color: #374151; /* text-gray-700 */
        font-size: 10px;
      }
      
      .date-cell {
        color: #111827; /* text-gray-900 */
        white-space: nowrap;
      }
      
      /* Status indicators */
      .remarks-functional {
        color: #166534; /* text-green-800 */
        background-color: #dcfce7; /* bg-green-100 */
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 4px;
        display: inline-block;
      }
      
      .remarks-non-functional {
        color: #991b1b; /* text-red-800 */
        background-color: #fee2e2; /* bg-red-100 */
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 4px;
        display: inline-block;
      }
      
      .remarks-repair {
        color: #92400e; /* text-yellow-800 */
        background-color: #fef3c7; /* bg-yellow-100 */
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 4px;
        display: inline-block;
      }
      
      .remarks-maintenance {
        color: #3730a3; /* text-indigo-800 */
        background-color: #e0e7ff; /* bg-indigo-100 */
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 4px;
        display: inline-block;
      }
      
      /* Summary cells */
      .summary-cell {
        background-color: #e5e7eb; /* bg-gray-200 */
        font-weight: bold;
        border: 1px solid #9ca3af; /* border-gray-400 */
      }
      
      /* Footer */
      .report-footer {
        color: #6b7280; /* text-gray-500 */
        font-size: 10px;
        text-align: right;
        padding: 8px;
        border-top: 2px solid #d1d5db; /* border-gray-300 */
        margin-top: 20px;
      }
    </style>
  `;

  // Get the current data based on active tab
  const isDetailed = activeTab === 'detailed';
  const currentData = isDetailed 
    ? detailedTable.getRowModel().rows.map(row => row.original) 
    : groupedTable.getRowModel().rows.map(row => row.original);

  // Create Excel-compatible HTML with professional layout
  let excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <title>Inventory Management Report</title>
      ${headerStyle}
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${isDetailed ? 'Detailed Inventory' : 'Maintenance Summary'}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
                <x:FitToPage/>
                <x:Print>
                  <x:ValidPrinterInfo/>
                  <x:PaperSizeIndex>9</x:PaperSizeIndex>
                  <x:Scale>85</x:Scale>
                  <x:HorizontalResolution>600</x:HorizontalResolution>
                  <x:VerticalResolution>600</x:VerticalResolution>
                </x:Print>
                <x:Selected/>
                <x:FreezePanes/>
                <x:FrozenNoSplit/>
                <x:SplitHorizontal>1</x:SplitHorizontal>
                <x:TopRowBottomPane>1</x:TopRowBottomPane>
                <x:ActivePane>2</x:ActivePane>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      <table>
        <!-- Report Header -->
        <tr>
          <td colspan="${isDetailed ? 9 : 4}" class="report-header">
            CARAGA STATE UNIVERSITY
          </td>
        </tr>
        <tr>
          <td colspan="${isDetailed ? 9 : 4}" class="university-header">
            College of Engineering and Geosciences (CEGS)
          </td>
        </tr>
        <tr>
          <td colspan="${isDetailed ? 9 : 4}" class="subheader">
            ${isDetailed ? 'DETAILED EQUIPMENT INVENTORY REPORT' : 'MAINTENANCE SUMMARY REPORT'}
          </td>
        </tr>
        
        <!-- Report Metadata -->
        <tr>
          <td colspan="${isDetailed ? 5 : 2}" style="border: none; padding: 8px 0; font-size: 10px;">
            <strong>Generated:</strong> ${new Date().toLocaleString()}
          </td>
          <td colspan="${isDetailed ? 4 : 2}" style="border: none; text-align: right; padding: 8px 0; font-size: 10px;">
            <strong>Total Records:</strong> ${currentData.length}
          </td>
        </tr>
        
        <!-- Column Headers -->
        <tr>
  `;

  // Add column headers based on active tab
  if (isDetailed) {
    const headers = ['Category', 'Office', 'Faculty', 'Equipment Name', 'Serial Number', 'Date Acquired', 'Remarks', 'Maintenance Activity', 'Maintenance Schedule'];
    excelContent += headers.map(header => `<th>${header}</th>`).join('');
  } else {
    const headers = ['Equipment Name', 'Maintenance Activity', 'Maintenance Schedule', 'Total Units'];
    excelContent += headers.map(header => `<th>${header}</th>`).join('');
  }

  excelContent += `
        </tr>
  `;

  // Add data rows with enhanced styling
  if (isDetailed) {
    (currentData as InventoryItem[]).forEach((item, index) => {
      const rowClass = index % 2 === 0 ? '' : 'class="alt-row"';
      
      // Determine remarks class based on content
      let remarksClass = '';
      if (item.remarks) {
        const remarkLower = item.remarks.toLowerCase();
        if (remarkLower.includes('functional')) remarksClass = 'remarks-functional';
        else if (remarkLower.includes('non-functional')) remarksClass = 'remarks-non-functional';
        else if (remarkLower.includes('repair')) remarksClass = 'remarks-repair';
        else if (remarkLower.includes('maintenance')) remarksClass = 'remarks-maintenance';
      }
      
      excelContent += `
        <tr ${rowClass}>
          <td class="category-cell">${item.category || '-'}</td>
          <td>${item.office_name || '-'}</td>
          <td>${item.faculty_name || '-'}</td>
          <td><strong>${item.equipment_name}</strong></td>
          <td class="serial-cell">${item.serial_number || 'N/A'}</td>
          <td class="date-cell">${item.date_acquired ? new Date(item.date_acquired).toLocaleDateString() : '-'}</td>
          <td><span class="${remarksClass}">${item.remarks || 'Functional'}</span></td>
          <td>${item.maintenance_activities || 'No scheduled activity'}</td>
          <td>${item.maintenance_schedule || 'Not scheduled'}</td>
        </tr>
      `;
    });
    
    // Add summary row for detailed report
    if (currentData.length > 0) {
      excelContent += `
        <tr>
          <td colspan="6" class="summary-cell">TOTAL EQUIPMENT</td>
          <td colspan="3" class="summary-cell">${currentData.length} items</td>
        </tr>
      `;
    }
  } else {
    (currentData as GroupedItem[]).forEach((item, index) => {
      const rowClass = index % 2 === 0 ? '' : 'class="alt-row"';
      
      excelContent += `
        <tr ${rowClass}>
          <td><strong>${item.equipment_name}</strong></td>
          <td>${item.maintenance_activities || 'No scheduled activity'}</td>
          <td>${item.maintenance_schedule || 'Not scheduled'}</td>
          <td style="text-align: center; font-weight: bold;">${item.number_of_units}</td>
        </tr>
      `;
    });
    
    // Add summary row for grouped report
    if (currentData.length > 0) {
      const totalUnits = (currentData as GroupedItem[]).reduce((sum, item) => sum + item.number_of_units, 0);
      excelContent += `
        <tr>
          <td colspan="3" class="summary-cell">TOTAL UNITS</td>
          <td class="summary-cell" style="text-align: center;">${totalUnits}</td>
        </tr>
      `;
    }
  }

  // Add report footer
  excelContent += `
      </table>
      
      <!-- Report Footer -->
      <div class="report-footer">
        Generated by CSU Create & DABE Inventory Management System | ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `;

  // Create and download the file
  const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CSU_Inventory_Report_${isDetailed ? 'Detailed' : 'Maintenance'}_${new Date().toISOString().split('T')[0]}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Records" />
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Inventory Reports
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate and export detailed inventory reports for management and maintenance.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button variant="outline" size="sm" onClick={fetchData} className="ml-4">
              Retry
            </Button>
          </Alert>
        )}

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8"
                  value={(activeTab === 'detailed' 
                    ? (detailedTable.getColumn("equipment_name")?.getFilterValue() as string) ?? ""
                    : (groupedTable.getColumn("equipment_name")?.getFilterValue() as string) ?? "")}
                  onChange={(e) => {
                    if (activeTab === 'detailed') {
                      detailedTable.getColumn("equipment_name")?.setFilterValue(e.target.value);
                    } else {
                      groupedTable.getColumn("equipment_name")?.setFilterValue(e.target.value);
                    }
                  }}
                  disabled={isLoading || !!error}
                />
              </div>
              
              <div className='m-4'>
                <Button className='m-2' variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button> 

                <Button 
                  size="sm"
                  onClick={exportToCSV}
                  disabled={isLoading || (activeTab === 'detailed' ? inventoryItems.length === 0 : groupedItems.length === 0)}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="detailed" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="detailed">Inventory Records</TabsTrigger>
                <TabsTrigger value="grouped">Maintenance Records</TabsTrigger>
              </TabsList>

              {/* Detailed Records */}
              <TabsContent value="detailed">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {detailedTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            {Array.from({ length: detailedColumns.length }).map((_, i) => (
                              <TableCell key={i}><Skeleton className="h-4 w-24" /></TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : detailedTable.getRowModel().rows?.length ? (
                        detailedTable.getRowModel().rows.map((row) => (
                          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className='border whitespace-normal p-4'>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={detailedColumns.length} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                {error ? 'Error loading records' : 'No detailed records found.'}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Page {detailedTable.getState().pagination.pageIndex + 1} of{" "}
                    {detailedTable.getPageCount()} • {inventoryItems.length} total items
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => detailedTable.previousPage()}
                      disabled={!detailedTable.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => detailedTable.nextPage()}
                      disabled={!detailedTable.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Grouped Records */}
              <TabsContent value="grouped">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {groupedTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            {Array.from({ length: groupedColumns.length }).map((_, i) => (
                              <TableCell key={i}><Skeleton className="h-4 w-24 " /></TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : groupedTable.getRowModel().rows?.length ? (
                        groupedTable.getRowModel().rows.map((row) => (
                          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className='whitespace-normal p-4'>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={groupedColumns.length} className=" h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <FileText className="h-8  w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                {error ? 'Error loading records' : 'No grouped records found.'}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Page {groupedTable.getState().pagination.pageIndex + 1} of{" "}
                    {groupedTable.getPageCount()} • {groupedItems.length} total items
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => groupedTable.previousPage()}
                      disabled={!groupedTable.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => groupedTable.nextPage()}
                      disabled={!groupedTable.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}