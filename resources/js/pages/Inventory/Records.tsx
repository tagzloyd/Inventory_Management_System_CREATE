import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '/records' },
];

type InventoryItem = {
    id: number;
    categories: { id: number; name: string }[];
    office?: { id: number; office_name: string };
    equipment_name: string;
    serial_number: string;
    date_acquired: string;
    notes?: string;
    category_id?: number;
    office_id?: number;
    remarks?: string;
};

export default function InventoryRecords() {
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [offices, setOffices] = useState<{ id: number; office_name: string }[]>([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<keyof InventoryItem | ''>('');
    const [sortAsc, setSortAsc] = useState(true);
    const [filterCategory, setFilterCategory] = useState<number | ''>('');
    const [filterOffice, setFilterOffice] = useState<number | ''>('');

    useEffect(() => {
        fetchInventory();
        fetchCategories();
        fetchOffices();
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

    // Filtering, searching, and sorting logic
    const filteredData = useMemo(() => {
        let data = [...inventoryData];

        // Filter by categories
        if (filterCategory) {
            data = data.filter(item => 
                item.categories.some(cat => cat.id === filterCategory)
            );
        }

        // Filter by office
        if (filterOffice) {
            data = data.filter(item => item.office?.id === filterOffice);
        }

        // Search
        if (search.trim() !== '') {
            const s = search.toLowerCase();
            data = data.filter(item =>
                item.equipment_name.toLowerCase().includes(s) ||
                item.serial_number?.toLowerCase().includes(s) ||
                item.categories.some(cat => cat.name.toLowerCase().includes(s)) ||
                item.office?.office_name?.toLowerCase().includes(s) ||
                item.date_acquired.toLowerCase().includes(s) ||
                (item.notes?.toLowerCase().includes(s) ?? false)
            );
        }

        // Sort
        if (sortKey) {
            data.sort((a, b) => {
                let aValue: any = a[sortKey];
                let bValue: any = b[sortKey];
                // For categories, sort by first category name
                if (sortKey === 'categories') {
                    aValue = a.categories[0]?.name || '';
                    bValue = b.categories[0]?.name || '';
                }
                // For office, sort by office_name
                if (sortKey === 'office') {
                    aValue = a.office?.office_name || '';
                    bValue = b.office?.office_name || '';
                }
                if (aValue < bValue) return sortAsc ? -1 : 1;
                if (aValue > bValue) return sortAsc ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [inventoryData, search, sortKey, sortAsc, filterCategory, filterOffice]);

    // Export to CSV
    const exportCSV = () => {
        const headers = ['Categories', 'Office', 'Equipment Name', 'Serial Number', 'Date Acquired', 'Notes', 'Remarks'];
        const rows = filteredData.map(item => [
            item.categories.map(cat => cat.name).join(', ') || '',
            item.office?.office_name || '',
            item.equipment_name,
            item.serial_number,
            item.date_acquired,
            item.notes || '',
            item.remarks || ''
        ]);
        const csvContent =
            [headers, ...rows]
                .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
                .join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_records.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Print
    const printTable = () => {
        const printSection = document.getElementById('print-section');
        if (printSection) {
            // Clone the table and remove sort icons
            const cloned = printSection.cloneNode(true) as HTMLElement;
            // Remove all sort icons (▲ ▼ ⇅) from the cloned table
            cloned.querySelectorAll('span').forEach(span => {
                if (
                    span.textContent === '▲' ||
                    span.textContent === '▼' ||
                    span.textContent === '⇅'
                ) {
                    span.remove();
                }
            });

            const printContent = cloned.innerHTML;
            const win = window.open('', '', 'width=900,height=700');
            win?.document.write(`
                <html>
                <head>
                    <title>CReATe</title>
                    <style>
                        @media print {
                            @page { margin: 24mm 16mm 24mm 16mm; }
                            body { margin: 0; }
                        }
                        body {
                            font-family: 'Segoe UI', Arial, sans-serif;
                            background: #fff;
                            margin: 0;
                            padding: 0;
                            color: #22223b;
                        }
                        .header {
                            text-align: center;
                            margin-top: 12px;
                            margin-bottom: 24px;
                        }
                        .header h2 {
                            margin: 0;
                            font-size: 2rem;
                            font-weight: 700;
                            color: #1e293b;
                            letter-spacing: 1px;
                        }
                        .header .subtitle {
                            font-size: 1rem;
                            color: #64748b;
                            margin-top: 4px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 16px;
                            background: #fff;
                            box-shadow: 0 2px 8px #0001;
                        }
                        th, td {
                            border: 1px solid #e5e7eb;
                            padding: 10px 14px;
                            text-align: left;
                            font-size: 1rem;
                        }
                        th {
                            background: #f1f5f9;
                            color: #0f172a;
                            font-weight: 600;
                            letter-spacing: 0.5px;
                        }
                        tr:nth-child(even) td {
                            background: #f9fafb;
                        }
                        tr:hover td {
                            background: #e0e7ef;
                        }
                        .footer {
                            text-align: right;
                            font-size: 0.95rem;
                            color: #64748b;
                            margin-top: 32px;
                            border-top: 1px solid #e5e7eb;
                            padding-top: 12px;
                        }
                        .sign-section {
                            margin-top: 48px;
                            display: flex;
                            justify-content: flex-end;
                            gap: 80px;
                        }
                        .sign-label {
                            font-size: 1rem;
                            color: #64748b;
                            margin-bottom: 40px;
                        }
                        .sign-line {
                            border-bottom: 1px solid #22223b;
                            width: 200px;
                            margin-bottom: 4px;
                        }
                        .category-badge {
                            display: inline-block;
                            background: #f1f5f9;
                            border: 1px solid #e5e7eb;
                            border-radius: 9999px;
                            padding: 2px 8px;
                            font-size: 0.75rem;
                            margin: 2px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="subtitle">Office Equipment Records</div>
                    </div>
                    ${printContent}
                    <div class="sign-section">
                        <div>
                            <div class="sign-label">Prepared by:</div>
                            <div class="sign-line"></div>
                        </div>
                        <div>
                            <div class="sign-label">Checked by:</div>
                            <div class="sign-line"></div>
                        </div>
                    </div>
                    <div class="footer">Printed on: ${new Date().toLocaleString()}</div>
                </body>
                </html>
            `);
            win?.document.close();
            setTimeout(() => {
                win?.focus();
                win?.print();
                win?.close();
            }, 300);
        }
    };

    // Table column headers with sort
    const renderSortIcon = (key: keyof InventoryItem | 'categories' | 'office') => (
        <span
            className="ml-1 cursor-pointer select-none"
            onClick={() => {
                if (sortKey === key) setSortAsc(!sortAsc);
                else { setSortKey(key as keyof InventoryItem); setSortAsc(true); }
            }}
        >
            {sortKey === key ? (sortAsc ? '▲' : '▼') : '⇅'}
        </span>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Records" />
            <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Records</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage and export your office equipment records.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-48"
                        />
                        <select
                            className="border px-2 py-1 rounded"
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value ? Number(e.target.value) : '')}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <select
                            className="border px-2 py-1 rounded"
                            value={filterOffice}
                            onChange={e => setFilterOffice(e.target.value ? Number(e.target.value) : '')}
                        >
                            <option value="">All Offices</option>
                            {offices.map(office => (
                                <option key={office.id} value={office.id}>{office.office_name}</option>
                            ))}
                        </select>
                        <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
                        <Button variant="outline" onClick={printTable}>Print</Button>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow border p-6" id="print-section">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer" onClick={() => { setSortKey('categories'); setSortAsc(sortKey === 'categories' ? !sortAsc : true); }}>
                                    Category {renderSortIcon('categories')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => { setSortKey('equipment_name'); setSortAsc(sortKey === 'equipment_name' ? !sortAsc : true); }}>
                                    Equipment Name {renderSortIcon('equipment_name')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => { setSortKey('serial_number'); setSortAsc(sortKey === 'serial_number' ? !sortAsc : true); }}>
                                    Serial Number {renderSortIcon('serial_number')}
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => { setSortKey('date_acquired'); setSortAsc(sortKey === 'date_acquired' ? !sortAsc : true); }}>
                                    Date Acquired {renderSortIcon('date_acquired')}
                                </TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                                        No inventory data.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map(item => (
                                    <TableRow key={item.id} className="hover:bg-blue-50 transition">
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {item.categories && item.categories.length > 0 ? (
                                                    item.categories.map(cat => (
                                                        <Badge key={cat.id} variant="outline">
                                                            {cat.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic">No categories</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.equipment_name}</TableCell>
                                        <TableCell>{item.serial_number}</TableCell>
                                        <TableCell>{item.date_acquired}</TableCell>
                                        <TableCell>{item.notes || 'N/A'}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
                                                ${item.remarks === "Non-Functional" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                {item.remarks || 'Functional'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}