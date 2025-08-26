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
          (item.faculty?.name && !item.faculty.name.includes("Others") && item.faculty.name.toLowerCase().includes(term)) ||
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


  // Add this helper function for Excel styling
  const exportCSV = () => {
    // Excel-specific styling
    const headerStyle = `
      <style>
        th {
          background-color: #1a5fb4;
          color: white;
          font-weight: bold;
          border: 1px solid #0b4491;
          padding: 8px;
        }
        td {
          border: 1px solid #e5e7eb;
          padding: 6px 8px;
        }
        .status-functional {
          color: #15803d;
          background-color: #dcfce7;
        }
        .status-non-functional {
          color: #dc2626;
          background-color: #fee2e2;
        }
        .status-repair {
          color: #ca8a04;
          background-color: #fef9c3;
        }
        .alt-row {
          background-color: #f8fafc;
        }
        .category-cell {
          color: #1d4ed8;
        }
        .serial-cell {
          font-family: Consolas, monospace;
          color: #4b5563;
        }
        .date-cell {
          color: #1f2937;
        }
      </style>
    `;

    if (filteredData.length === 0) {
      toast.warning('No data to export');
      return;
    }

    // Create Excel-compatible HTML
    let excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        ${headerStyle}
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${getReportTitle()}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        <table>
          <tr>
            <td colspan="${getReportHeaders().length}" style="font-size: 16px; font-weight: bold; padding: 10px 0;">
              ${getReportTitle()} - Create and Dabe Inventory Management System
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; font-weight: bold; padding: 10px 0;">
              Caraga State University
            </td>
          </tr>
          <tr>
            <td colspan="${getReportHeaders().length}" style="font-size: 11px; color: #666; padding: 5px 0;">
              Generated on: ${new Date().toLocaleString()}
            </td>
          </tr>
          <tr></tr>
          <tr>
            ${getReportHeaders().map(header => 
              `<th>${header}</th>`
            ).join('')}
          </tr>
    `;

    // Add data rows with alternating colors and styled cells
    let dataToExport: any[] = [];
    if (selectedReport === 'condition' && (reportData as any).items) {
      dataToExport = (reportData as any).items;
    } else {
      dataToExport = reportData as any[];
    }

    dataToExport.forEach((item: any, index: number) => {
      const rowClass = index % 2 === 0 ? '' : 'class="alt-row"';
      excelContent += `
        <tr ${rowClass}>
          ${Object.entries(item).map(([key, value]) => {
            // Handle nested objects for faculty and office/location
            if (key === 'faculty') {
              return `<td>${typeof value === 'object' && value !== null && 'name' in value && typeof value.name === 'string'
                ? (value.name.includes("Others") ? "Unassigned Equipment" : value.name)
                : 'Unassigned'}</td>`;
            }
            if (key === 'office') {
              return `<td>${typeof value === 'object' && value !== null && 'office_name' in value ? (value as { office_name: string }).office_name : 'Unassigned'}</td>`;
            }
            // Handle other special cases
            if (key === 'remarks' || key === 'status') {
              return `<td class="status-${typeof value === 'string' ? value.toLowerCase() : ''}">${value || 'Functional'}</td>`;
            }
            if (key === 'serial_number' || key === 'serial') {
              return `<td class="serial-cell">${value || 'N/A'}</td>`;
            }
            if (key === 'date_acquired') {
              return `<td class="date-cell">${value ? new Date(value as string).toLocaleDateString() : 'N/A'}</td>`;
            }
            if (key === 'categories') {
              if (Array.isArray(value)) {
                return `<td class="category-cell">${value.map(c => c.name).join(', ')}</td>`;
              }
              return `<td class="category-cell">${value}</td>`;
            }
            return `<td>${value || '-'}</td>`;
          }).join('')}
        </tr>
      `;
    });

    excelContent += `
        </table>
      </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CSU_Inventory_${selectedReport}_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Excel export completed');
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
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Inventory-specific metadata
    const inventoryMetadata = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 12px; color: #475569;">
        <div>
          <strong>Inventory ID:</strong> INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
        </div>
        <div>
          <strong>Department:</strong> ${filterOffice !== 'all' 
            ? offices.find(o => o.id.toString() === filterOffice)?.office_name 
            : 'All Departments'}
        </div>
        <div>
          <strong>Audit Period:</strong> Q${Math.floor((new Date().getMonth() + 3) / 3)} ${new Date().getFullYear()}
        </div>
      </div>
    `;

    // Organization letterhead simulation
    const orgHeader = `
      <div style="margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 8px; 
              display: flex; align-items: center; justify-content: center; color: #64748b;">
            <img src="/images/csu-logo.png" alt="CSU Logo" style="max-width: 100%; max-height: 100%;">
          </div>
          <div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1e293b;">
              ${reportTitle}
            </h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">
              <strong>Caraga State University</strong><br>
              Generated on ${currentDate} | ${filteredData.length} items
            </p>
          </div>
        </div>
        ${inventoryMetadata}
      </div>
    `;

    // Executive summary for important reports
    const executiveSummary = selectedReport === 'condition' ? `
      <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin-bottom: 20px; 
          border-left: 4px solid #3b82f6;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #1e40af;">
          <i class="fas fa-chart-pie" style="margin-right: 8px;"></i> Maintenance Overview
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
          <div style="background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Functional Equipment</div>
            <div style="font-size: 20px; font-weight: 600; color: #166534;">
              ${(reportData as any).summary.find((s: any) => s.status === 'Functional')?.count || 0}
              <span style="font-size: 12px; color: #64748b; margin-left: 5px;">items</span>
            </div>
          </div>
          <div style="background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Needs Repair</div>
            <div style="font-size: 20px, font-weight: 600; color: #b91c1c;">
              ${(reportData as any).summary.filter((s: any) => 
                s.status === 'Non-Functional' || s.status === 'Under Repair').reduce((a: number, b: any) => a + b.count, 0)}
              <span style="font-size: 12px; color: #64748b; margin-left: 5px;">items</span>
            </div>
          </div>
        </div>
      </div>
    ` : '';

    // Filter summary with inventory-specific context
    const activeFilters = [];
    if (filterCategory !== 'all') {
      const category = categories.find(c => c.id.toString() === filterCategory);
      activeFilters.push(`<strong>Category:</strong> ${category?.name || ''}`);
    }
    if (filterFaculty !== 'all') {
      const faculty = faculties.find(f => f.id.toString() === filterFaculty);
      activeFilters.push(`<strong>Responsible:</strong> ${faculty?.name.includes("Others") ? "Unassigned" : faculty?.name || ''}`);
    }
    if (filterOffice !== 'all') {
      const office = offices.find(o => o.id.toString() === filterOffice);
      activeFilters.push(`<strong>Location:</strong> ${office?.office_name || ''}`);
    }
    if (searchTerm) {
      activeFilters.push(`<strong>Search:</strong> "${searchTerm}"`);
    }

    const filterSummary = `
      <div style="margin-bottom: 20px; font-size: 12px; color: #475569; 
          background: #f8fafc; padding: 10px 15px; border-radius: 6px; 
          border-left: 4px solid #94a3b8; display: flex; flex-wrap: wrap; gap: 15px;">
        <div style="font-weight: 600; color: #334155;">Report Filters:</div>
        ${activeFilters.length > 0 ? activeFilters.join('<span style="color: #cbd5e1;"> • </span>') : 'None (showing all inventory)'}
      </div>
    `;

    // Generate rows with inventory-specific formatting
    switch (selectedReport) {
      case 'master':
        rows = (reportData as any[]).map((item, index) => [
          item.categories.map((c: any) => c.name).join(', '),
          item.equipment_name,
          item.serial_number || '<span style="color: #94a3b8;">N/A</span>',
          item.faculty?.name?.includes("Others") 
            ? '<span style="color: #94a3b8;">Unassigned</span>' 
            : item.faculty?.name || '<span style="color: #94a3b8;">Unassigned</span>',
          item.office?.office_name || '<span style="color: #94a3b8;">Storage</span>',
          item.remarks 
            ? `<span class="status-badge ${getStatusClass(item.remarks)}">${item.remarks}</span>`
            : '<span class="status-badge status-functional">Functional</span>',
          item.date_acquired 
            ? new Date(item.date_acquired).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : '<span style="color: #b91c1c;">Missing</span>',
          item.notes 
            ? `<div style="max-width: 200px; white-space: normal;">${item.notes}</div>`
            : '<span style="color: #94a3b8;">-</span>'
        ]);
        break;
      
      case 'condition':
        const conditionData = reportData as any;
        rows = conditionData.items.map((item: any) => [
          item.equipment_name,
          item.serial_number || '<span style="color: #94a3b8;">N/A</span>',
          `<span class="status-badge ${getStatusClass(item.status)}">${item.status}</span>`,
          item.category,
          item.faculty?.includes("Others") 
            ? '<span style="color: #94a3b8;">Unassigned</span>' 
            : item.faculty || '<span style="color: #94a3b8;">Unassigned</span>'
        ]);
        break;
      
      case 'location':
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '<span style="color: #94a3b8;">N/A</span>',
          item.category,
          `<span class="status-badge ${getStatusClass(item.status)}">${item.status}</span>`,
          `<div style="display: flex; align-items: center; gap: 5px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #3b82f6;"></span>
            ${item.location}
          </div>`
        ]);
        break;
      
      case 'faculty':
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '<span style="color: #94a3b8;">N/A</span>',
          `<span class="status-badge ${getStatusClass(item.status)}">${item.status}</span>`,
          item.location || '<span style="color: #94a3b8;">Unassigned</span>',
          item.faculty?.includes("Others") 
            ? '<span style="color: #94a3b8;">Unassigned</span>' 
            : item.faculty || '<span style="color: #94a3b8;">Unassigned</span>',
          item.notes 
            ? `<div style="max-width: 200px; white-space: normal;">${item.notes}</div>`
            : '<span style="color: #94a3b8;">-</span>'
        ]);
        break;
      
      case 'missing-date':
        rows = (reportData as any[]).map(item => [
          item.equipment_name,
          item.serial_number || '<span style="color: #94a3b8;">N/A</span>',
          item.category,
          `<span class="status-badge ${getStatusClass(item.status)}">${item.status}</span>`,
          `<span style="color: #b91c1c; font-weight: 500;">Requires Update</span>`
        ]);
        break;
    }

    // Helper function for status badges
    function getStatusClass(status: string) {
      return status === 'Functional' ? 'status-functional' :
            status === 'Non-Functional' ? 'status-nonfunctional' :
            status === 'Under Repair' ? 'status-under-repair' :
            status === 'Pending' ? 'status-pending' : '';
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle} - Inventory Report</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
          <style>
            @media print {
              @page {
                size: A4 portrait;
                margin: 15mm 10mm;
                @top-left {
                  content: "${reportTitle}";
                  font-size: 11px;
                  color: #64748b;
                  font-family: 'Segoe UI', sans-serif;
                }
                @bottom-left {
                  content: "Report - Caraga State University";
                  font-size: 11px;
                  color: #64748b;
                }
                @bottom-right {
                  content: "Page " counter(page) " of " counter(pages);
                  font-size: 11px;
                  color: #64748b;
                }
              }
              body { 
                margin: 0;
                color: #1e293b;
                font-size: 11pt;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              }
              .no-print { display: none !important; }
            }
            body {
              font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #1e293b;
              font-size: 12px;
              line-height: 1.4;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0 20px;
              font-size: 11px;
              page-break-inside: avoid;
            }
            th {
              background: #f1f5f9;
              font-weight: 600;
              text-align: left;
              padding: 8px 10px;
              border: 1px solid #e2e8f0;
              color: #334155;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            td {
              padding: 8px 10px;
              border: 1px solid #e2e8f0;
              vertical-align: top;
              font-size: 11px;
            }
            tr:nth-child(even) td {
              background-color: #f8fafc;
            }
            .status-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 0.3px;
            }
            .status-functional {
              background: #dcfce7;
              color: #166534;
              border: 1px solid #bbf7d0;
            }
            .status-nonfunctional {
              background: #fee2e2;
              color: #991b1b;
              border: 1px solid #fecaca;
            }
            .status-under-repair {
              background: #fef9c3;
              color: #854d0e;
              border: 1px solid #fef08a;
            }
            .status-pending {
              background: #e0f2fe;
              color: #0369a1;
              border: 1px solid #bae6fd;
            }
            .footer {
              text-align: right;
              font-size: 10px;
              color: #64748b;
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #e2e8f0;
            }
            .page-break {
              page-break-after: always;
            }
            .text-muted {
              color: #64748b;
            }
            .text-center {
              text-align: center;
            }
            .nowrap {
              white-space: nowrap;
            }
            .signature-line {
              display: inline-block;
              width: 150px;
              border-top: 1px solid #94a3b8;
              margin: 30px 0 5px;
            }
          </style>
        </head>
        <body>
          ${orgHeader}
          ${executiveSummary}
          ${filterSummary}
          
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map((row: any[]) => `
                <tr>
                  ${row.map((cell: any) => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <div style="margin-top: 40px;">
              <div class="signature-line"></div>
              <div style="font-size: 11px; color: #475569;">Prepared by: ${/* Add user name here */ 'CREATE & DABE - Inventory Management'}</div>
            </div>
            <div style="margin-top: 10px;">
              <div style="font-size: 10px; color: #64748b;">
                Printed on: ${new Date().toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div style="font-size: 9px; color: #94a3b8; margin-top: 5px;">
                Inventory Management System • Report ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
    toast.success('Report generated successfully');
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

    const renderFacultyName = (faculty?: { name: string }) => {
      if (!faculty) return 'Unassigned';
      return faculty.name.includes("Others") ? "Unassigned Equipment" : faculty.name;
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
                          {faculty.name.includes("Others") ? "Unassigned Equipment" : faculty.name}
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
                              <TableCell>{renderFacultyName(item.faculty)}</TableCell>
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
                              <TableCell>{item.faculty?.includes("Others") ? "Unassigned Equipment" : item.faculty || 'Unassigned'}</TableCell>
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
                              <TableCell>{item.faculty?.includes("Others") ? "Unassigned Equipment" : item.faculty || 'Unassigned'}</TableCell>
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