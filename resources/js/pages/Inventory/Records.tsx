import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Printer, FileText, FileSpreadsheet } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inventory Management', href: '/dashboard'},
  { title: 'Reports', href: '/records' }
];

type InventoryItem = {
  id: number;
  categories: { id: number; name: string }[];
  faculty?: { id: number; name: string };
  office?: { id: number; office_name: string };
  equipment_name: string;
  serial_number: string;
  date_acquired: string;
  notes?: string;
  remarks?: string;
};

export default function InventoryRecords() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [offices, setOffices] = useState<{ id: number; office_name: string }[]>([]);
  const [faculties, setFaculties] = useState<{ id: number; name: string }[]>([]);
  const [selectedReport, setSelectedReport] = useState('master');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [filterOffice, setFilterOffice] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchInventory(),
          fetchCategories(),
          fetchOffices(),
          fetchFaculties()
        ]);
      } catch (error) {
        toast.error('Failed to load inventory data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchInventory = async () => {
    const res = await axios.get('/api/inventory');
    setInventoryData(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get('/api/categories');
    setCategories(res.data);
  };

  const fetchOffices = async () => {
    const res = await axios.get('/api/offices');
    setOffices(res.data);
  };

  const fetchFaculties = async () => {
    const res = await axios.get('/api/faculties');
    setFaculties(res.data);
  };

  const filteredData = useMemo(() => {
    let data = [...inventoryData];

    if (filterCategory && filterCategory !== "all") {
      data = data.filter(item => 
        item.categories.some(cat => cat.id.toString() === filterCategory)
      );
    }
    if (filterFaculty && filterFaculty !== "all") {
      data = data.filter(item => item.faculty?.id.toString() === filterFaculty);
    }
    if (filterOffice && filterOffice !== "all") {
      data = data.filter(item => item.office?.id.toString() === filterOffice);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.equipment_name.toLowerCase().includes(term) ||
        item.serial_number?.toLowerCase().includes(term) ||
        item.categories.some(c => c.name.toLowerCase().includes(term)) ||
        item.office?.office_name?.toLowerCase().includes(term) ||
        item.faculty?.name?.toLowerCase().includes(term) ||
        item.remarks?.toLowerCase().includes(term)
      );
    }

    return data;
  }, [inventoryData, filterCategory, filterFaculty, filterOffice, searchTerm]);

  const reportData = useMemo(() => {
    switch (selectedReport) {
      case 'master':
        return filteredData.map(item => ({
          categories: item.categories,
          equipment_name: item.equipment_name,
          serial_number: item.serial_number,
          faculty: item.faculty,
          office: item.office,
          remarks: item.remarks,
          date_acquired: item.date_acquired,
          notes: item.notes
        }));
      
      case 'condition':
        const statusCounts = filteredData.reduce((acc, item) => {
          const status = item.remarks || 'Functional';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        return {
          items: filteredData.map(item => ({
            equipment_name: item.equipment_name,
            serial_number: item.serial_number,
            status: item.remarks || 'Functional',
            category: item.categories.map(c => c.name).join(', '),
            faculty: item.faculty?.name || 'Unassigned'
          })),
          summary: Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count
          }))
        };
      
      case 'location':
        return filteredData
          .filter(item => item.office)
          .map(item => ({
            equipment_name: item.equipment_name,
            serial_number: item.serial_number,
            category: item.categories.map(c => c.name).join(', '),
            status: item.remarks || 'Functional',
            location: item.office?.office_name
          }));
      
      case 'faculty':
        return filteredData
          .filter(item => item.faculty)
          .map(item => ({
            equipment_name: item.equipment_name,
            serial_number: item.serial_number,
            status: item.remarks || 'Functional',
            notes: item.notes,
            location: item.office?.office_name || 'Unassigned',
            faculty: item.faculty?.name
          }));
      
      case 'missing-date':
        return filteredData
          .filter(item => !item.date_acquired)
          .map(item => ({
            equipment_name: item.equipment_name,
            serial_number: item.serial_number,
            category: item.categories.map(c => c.name).join(', '),
            status: item.remarks || 'Functional',
            needsUpdate: 'Yes'
          }));
      
      default:
        return [];
    }
  }, [filteredData, selectedReport]);

  const exportCSV = () => {
    if (filteredData.length === 0) {
      toast.warning('No data to export');
      return;
    }

    let headers: string[] = [];
    let rows: any[] = [];

    switch (selectedReport) {
      case 'master':
        headers = ['Category', 'Equipment Name', 'Serial Number', 'Faculty', 'Location', 'Status', 'Date Acquired', 'Notes'];
        rows = (reportData as any[]).map(item => [
          item.categories.map((c: any) => c.name).join(', '),
          item.equipment_name,
          item.serial_number || '',
          item.faculty?.name || '',
          item.office?.office_name || '',
          item.remarks || 'Functional',
          item.date_acquired || '',
          item.notes || ''
        ]);
        break;
      
      case 'condition':
        headers = ['Equipment', 'Serial', 'Status', 'Category', 'Faculty'];
        rows = (reportData as any).items.map((item: any) => [
          item.equipment_name,
          item.serial_number || '',
          item.status,
          item.category,
          item.faculty
        ]);
        break;
      
      case 'location':
        headers = ['Equipment', 'Serial', 'Category', 'Status', 'Location'];
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '',
          item.category,
          item.status,
          item.location
        ]);
        break;
      
      case 'faculty':
        headers = ['Equipment', 'Serial', 'Status', 'Location', 'Faculty', 'Notes'];
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '',
          item.status,
          item.location,
          item.faculty,
          item.notes || ''
        ]);
        break;
      
      case 'missing-date':
        headers = ['Equipment', 'Serial', 'Category', 'Status', 'Needs Update'];
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '',
          item.category,
          item.status,
          item.needsUpdate
        ]);
        break;
    }

    const csvContent =
      [headers, ...rows]
        .map(row => row.map((field: any) => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${selectedReport}_report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export started');
  };

  const printReport = () => {
    if (filteredData.length === 0) {
      toast.warning('No data to print');
      return;
    }

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) {
      toast.error('Popup was blocked. Please allow popups for this site.');
      return;
    }

    const reportTitle = getReportTitle();
    const headers = getReportHeaders();
    let rows: any[] = [];

    switch (selectedReport) {
      case 'master':
        rows = (reportData as any[]).map(item => [
          item.categories.map((c: any) => c.name).join(', '),
          item.equipment_name,
          item.serial_number || '-',
          item.faculty?.name || 'Unassigned',
          item.office?.office_name || 'Unassigned',
          item.remarks || 'Functional',
          item.date_acquired || 'Missing',
          item.notes || '-'
        ]);
        break;
      
      case 'condition':
        const conditionData = reportData as any;
        printWindow.document.write(`
          <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Equipment Status Summary</h3>
            <table style="width: auto; margin-bottom: 20px;">
              ${conditionData.summary.map((s: any) => `
                <tr>
                  <td style="padding: 4px 8px;">${s.status}</td>
                  <td style="padding: 4px 8px; text-align: right;">${s.count}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `);
        
        rows = conditionData.items.map((item: any) => [
          item.equipment_name,
          item.serial_number || '-',
          item.status,
          item.category,
          item.faculty
        ]);
        break;
      
      case 'location':
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '-',
          item.category,
          item.status,
          item.location
        ]);
        break;
      
      case 'faculty':
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '-',
          item.status,
          item.location,
          item.faculty,
          item.notes || '-'
        ]);
        break;
      
      case 'missing-date':
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '-',
          item.category,
          item.status,
          item.needsUpdate
        ]);
        break;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            @media print {
              @page { margin: 15mm; }
              body { margin: 0; }
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 1.5rem;
              font-weight: 700;
            }
            .header .subtitle {
              font-size: 0.875rem;
              color: #64748b;
              margin-top: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 0.875rem;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background: #f1f5f9;
              font-weight: 600;
            }
            .status-functional {
              background: #dcfce7;
              color: #166534;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 0.75rem;
            }
            .status-nonfunctional {
              background: #fee2e2;
              color: #991b1b;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 0.75rem;
            }
            .status-under-repair {
              background: #fef9c3;
              color: #854d0e;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 0.75rem;
            }
            .footer {
              text-align: right;
              font-size: 0.75rem;
              color: #64748b;
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #e5e7eb;
            }
            .summary-table {
              width: auto;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${reportTitle}</h1>
            <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map((row: any[]) => `
                <tr>
                    ${row.map((cell: any, i: number) => {
                    const isStatusCell = headers[i] === 'Status';
                    let cellContent = cell;
                    if (isStatusCell) {
                      const statusClass = 
                        cell === 'Functional' ? 'status-functional' :
                        cell === 'Non-Functional' ? 'status-nonfunctional' :
                        cell === 'Under Repair' ? 'status-under-repair' : '';
                      cellContent = `<span class="${statusClass}">${cell}</span>`;
                    }
                    return `<td>${cellContent}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            Printed on: ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 300);
    toast.success('Print dialog opened');
  };

  const getReportTitle = () => {
    switch (selectedReport) {
      case 'master': return 'Inventory Master List';
      case 'condition': return 'Equipment Condition Report';
      case 'location': return 'Equipment by Location Report';
      case 'faculty': return 'Equipment Assigned to Faculty';
      default: return 'Inventory Report';
    }
  };

  const getReportHeaders = () => {
    switch (selectedReport) {
      case 'master':
        return ['Category', 'Equipment Name', 'Serial Number', 'Faculty', 'Location', 'Status', 'Date Acquired', 'Notes'];
      case 'condition':
        return ['Equipment', 'Serial', 'Status', 'Category', 'Faculty'];
      case 'location':
        return ['Equipment', 'Serial', 'Category', 'Status', 'Location'];
      case 'faculty':
        return ['Equipment', 'Serial', 'Status', 'Location', 'Faculty', 'Notes'];
      case 'missing-date':
        return ['Equipment', 'Serial', 'Category', 'Status', 'Needs Update'];
      default:
        return [];
    }
  };

  const renderStatusBadge = (status: string) => {
    const variant =
      status === 'Non-Functional' ? 'destructive' :
      status === 'Defective' ? 'destructive' :
      status === 'Under Repair' ? 'secondary' :
      'default';

    return (
      <Badge variant={variant} className="gap-1">
        {status || 'Functional'}
      </Badge>
    );
  };

  const renderSkeletonRows = (count: number, cols: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inventory Reports" />
      <Toaster richColors />
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inventory Reports</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Generate and export detailed inventory reports for management and maintenance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              onClick={exportCSV}
              disabled={isLoading || filteredData.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button 
              variant="outline" 
              onClick={printReport}
              disabled={isLoading || filteredData.length === 0}
            >
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{getReportTitle()}</CardTitle>
            <CardDescription className="text-sm">
              {selectedReport === 'master' && 'Comprehensive list of all equipment in the system'}
              {selectedReport === 'condition' && 'Analysis of equipment condition for maintenance planning'}
              {selectedReport === 'location' && 'Detailed view of equipment distribution by location'}
              {selectedReport === 'faculty' && 'Inventory assigned to specific faculty members'}
              {selectedReport === 'missing-date' && 'Equipment records missing acquisition dates'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedReport} onValueChange={setSelectedReport}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="master">Master List</TabsTrigger>
                <TabsTrigger value="condition">Condition</TabsTrigger>
                <TabsTrigger value="location">By Location</TabsTrigger>
                <TabsTrigger value="faculty">By Faculty</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap items-center gap-4 my-4">
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                  disabled={isLoading}
                />

                <Select 
                  value={filterCategory} 
                  onValueChange={setFilterCategory}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filterFaculty} 
                  onValueChange={setFilterFaculty}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Faculty</SelectItem>
                    {faculties.map(faculty => (
                      <SelectItem key={faculty.id} value={faculty.id.toString()}>
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filterOffice} 
                  onValueChange={setFilterOffice}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {offices.map(office => (
                      <SelectItem key={office.id} value={office.id.toString()}>
                        {office.office_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {getReportHeaders().map(header => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      renderSkeletonRows(5, getReportHeaders().length)
                    ) : selectedReport === 'condition' && (reportData as any).items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={getReportHeaders().length} className="h-24 text-center text-gray-500">
                          No data found for the selected filters.
                        </TableCell>
                      </TableRow>
                    ) : selectedReport !== 'condition' && (reportData as any[]).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={getReportHeaders().length} className="h-24 text-center text-gray-500">
                          No data found for the selected filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {selectedReport === 'master' && (reportData as any[]).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {item.categories.map((cat: any) => (
                                  <Badge key={cat.id} variant="outline" className="text-xs">
                                    {cat.name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{item.equipment_name}</TableCell>
                            <TableCell className="text-muted-foreground">{item.serial_number || '-'}</TableCell>
                            <TableCell>{item.faculty?.name || 'Unassigned'}</TableCell>
                            <TableCell>{item.office?.office_name || 'Unassigned'}</TableCell>
                            <TableCell>{renderStatusBadge(item.remarks)}</TableCell>
                            <TableCell>{item.date_acquired || 'Missing'}</TableCell>
                            <TableCell className="text-muted-foreground">{item.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                        
                        {selectedReport === 'condition' && (reportData as any).items.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.equipment_name}</TableCell>
                            <TableCell className="text-muted-foreground">{item.serial_number || '-'}</TableCell>
                            <TableCell>{renderStatusBadge(item.status)}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.faculty}</TableCell>
                          </TableRow>
                        ))}
                        
                        {selectedReport === 'location' && (reportData as any[]).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.equipment_name}</TableCell>
                            <TableCell className="text-muted-foreground">{item.serial_number || '-'}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{renderStatusBadge(item.status)}</TableCell>
                            <TableCell>{item.location}</TableCell>
                          </TableRow>
                        ))}
                        
                        {selectedReport === 'faculty' && (reportData as any[]).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.equipment_name}</TableCell>
                            <TableCell className="text-muted-foreground">{item.serial_number || '-'}</TableCell>
                            <TableCell>{renderStatusBadge(item.status)}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.faculty}</TableCell>
                            <TableCell className="text-muted-foreground">{item.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}