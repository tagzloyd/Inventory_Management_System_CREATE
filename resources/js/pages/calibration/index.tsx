import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Download, FileText, FileSpreadsheet, Plus } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const breadcrumbs = [
    { title: 'Inventory Management', href: '/dashboard' },
    { title: 'Calibration', href: '/api/calibration' },
];

interface Calibration {
    id: number;
    instrument_name_or_eq_code: string;
    issued_to: string;
    freq_of_cal: string;
    planned?: {
        id?: number;
        jan: string | null;
        feb: string | null;
        mar: string | null;
        apr: string | null;
        may: string | null;
        jun: string | null;
        jul: string | null;
        aug: string | null;
        sep: string | null;
        oct: string | null;
        nov: string | null;
        dec: string | null;
    };
    actual?: {
        id?: number;
        jan: string | null;
        feb: string | null;
        mar: string | null;
        apr: string | null;
        may: string | null;
        jun: string | null;
        jul: string | null;
        aug: string | null;
        sep: string | null;
        oct: string | null;
        nov: string | null;
        dec: string | null;
    };
    remarks?: {
        id?: number;
        jan: string | null;
        feb: string | null;
        mar: string | null;
        apr: string | null;
        may: string | null;
        jun: string | null;
        jul: string | null;
        aug: string | null;
        sep: string | null;
        oct: string | null;
        nov: string | null;
        dec: string | null;
    };
}

export default function Calibration() {
    const [calibrations, setCalibrations] = useState<Calibration[]>([]);
    const [formData, setFormData] = useState({
        instrument_name_or_eq_code: '',
        issued_to: '',
        freq_of_cal: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [currentCalibration, setCurrentCalibration] = useState<Calibration | null>(null);
    const [currentField, setCurrentField] = useState<'planned' | 'actual' | 'remarks'>('planned');
    const [selectedMonths, setSelectedMonths] = useState<Record<string, boolean>>({});
    const [statusValue, setStatusValue] = useState('');
    const [remarksValue, setRemarksValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    useEffect(() => {
        fetchCalibrations();
    }, []);

    const fetchCalibrations = async () => {
        setIsLoading(true);
        const toastId = toast.loading('Loading calibration data...');
        try {
            const response = await fetch('/api/calibration/fetch');
            if (!response.ok) {
                throw new Error('Failed to fetch calibrations');
            }
            const data = await response.json();
            
            const transformedData = data.map((cal: any) => ({
                ...cal,
                planned: cal.planned ? cal.planned : null,
                actual: cal.actual ? cal.actual : null,
                remarks: cal.remarks ? cal.remarks : null
            }));
            
            setCalibrations(transformedData);
            toast.success('Calibration data loaded successfully', { id: toastId });
        } catch (error) {
            console.error('Error fetching calibrations:', error);
            toast.error('Failed to load calibration data. Please try again.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading('Creating calibration record...');
        try {
            const response = await fetch('/api/calibration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchCalibrations();
                setFormData({
                    instrument_name_or_eq_code: '',
                    issued_to: '',
                    freq_of_cal: ''
                });
                setIsDialogOpen(false);
                toast.success('Calibration record created successfully', { id: toastId });
            } else {
                throw new Error('Failed to create calibration');
            }
        } catch (error) {
            console.error('Error creating calibration:', error);
            toast.error('Failed to create calibration record', { id: toastId });
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCalibration) return;

        const toastId = toast.loading('Updating calibration record...');
        try {
            const response = await fetch(`/api/calibration/${currentCalibration.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchCalibrations();
                setIsEditDialogOpen(false);
                toast.success('Calibration updated successfully', { id: toastId });
            } else {
                throw new Error('Failed to update calibration');
            }
        } catch (error) {
            console.error('Error updating calibration:', error);
            toast.error('Failed to update calibration record', { id: toastId });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this calibration record?')) return;
        
        const toastId = toast.loading('Deleting calibration record...');
        try {
            const response = await fetch(`/api/calibration/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                await fetchCalibrations();
                toast.success('Calibration record and all related data deleted successfully', { id: toastId });
            } else {
                throw new Error('Failed to delete calibration');
            }
        } catch (error) {
            console.error('Error deleting calibration:', error);
            toast.error('Failed to delete calibration record', { id: toastId });
        }
    };

    const openEditDialog = (calibration: Calibration) => {
        setCurrentCalibration(calibration);
        setFormData({
            instrument_name_or_eq_code: calibration.instrument_name_or_eq_code,
            issued_to: calibration.issued_to || '',
            freq_of_cal: calibration.freq_of_cal || ''
        });
        setIsEditDialogOpen(true);
    };

    const handleMonthDataChange = async (
        calibrationId: number, 
        months: string[], 
        field: 'planned' | 'actual' | 'remarks', 
        value: string
    ) => {
        const toastId = toast.loading(`Updating ${field} data...`);
        try {
            const endpoint = `/api/calibration/${field}`;
            const data: any = {
                cal_id: calibrationId
            };

            const allMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            allMonths.forEach(month => {
                data[month] = null;
            });

            months.forEach(month => {
                data[month] = value;
            });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                await fetchCalibrations();
                toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} data updated successfully`, { id: toastId });
            } else {
                throw new Error(`Failed to update ${field} data`);
            }
        } catch (error) {
            console.error('Error updating calibration details:', error);
            toast.error(`Failed to update ${field} data`, { id: toastId });
        } finally {
            setIsStatusDialogOpen(false);
            setSelectedMonths({});
            setStatusValue('');
            setRemarksValue('');
        }
    };

    const openStatusDialog = (calibration: Calibration, field: 'planned' | 'actual' | 'remarks') => {
        setCurrentCalibration(calibration);
        setCurrentField(field);
        setIsStatusDialogOpen(true);
        
        const initialSelected: Record<string, boolean> = {};
        months.forEach(month => {
            initialSelected[month] = false;
        });
        setSelectedMonths(initialSelected);
    };

    const toggleMonthSelection = (month: string) => {
        setSelectedMonths(prev => ({
            ...prev,
            [month]: !prev[month]
        }));
    };

    const handleStatusSubmit = () => {
        const selectedMonthNames = Object.keys(selectedMonths).filter(month => selectedMonths[month]);
        
        if (selectedMonthNames.length === 0) {
            toast.warning('Please select at least one month');
            return;
        }
        
        const valueToUse = currentField === 'remarks' ? remarksValue : statusValue;
        if (currentCalibration) {
            handleMonthDataChange(
                currentCalibration.id,
                selectedMonthNames,
                currentField,
                valueToUse
            );
        }
    };

    const getMonthValue = (calibration: Calibration, field: 'planned' | 'actual' | 'remarks', month: string): string => {
        const fieldData = calibration[field];
        if (!fieldData) return '';
        
        const monthValue = fieldData[month as keyof typeof fieldData];
        return monthValue !== null && monthValue !== undefined ? String(monthValue) : '';
    };

    const exportCSV = () => {
        if (calibrations.length === 0) {
            toast.warning('No calibration data to export');
            return;
        }

        const headerStyle = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 20px 0;
                }
                th {
                    background-color: #1a5fb4;
                    color: white;
                    font-weight: bold;
                    text-align: center;
                    padding: 8px;
                    border: 1px solid #0b4491;
                    font-size: 11px;
                }
                td {
                    padding: 8px;
                    border: 1px solid #e5e7eb;
                    text-align: center;
                    font-size: 11px;
                }
                .instrument-cell {
                    font-weight: bold;
                    text-align: left;
                    background: white !important;
                    border-left: 1px solid #e5e7eb !important;
                }
                .info-cell {
                    background: white !important;
                }
                .planned-header {
                    background: #dbeafe !important;
                    color: #1d4ed8;
                    font-weight: bold;
                }
                .actual-header {
                    background: #dcfce7 !important;
                    color: #166534;
                    font-weight: bold;
                }
                .remarks-header {
                    background: #fef9c3 !important;
                    color: #713f12;
                    font-weight: bold;
                }
                .planned-data {
                    color: #1d4ed8;
                    background-color: #eff6ff;
                }
                .actual-data {
                    color: #166534;
                    background-color: #ecfdf5;
                }
                .remarks-data {
                    color: #713f12;
                    background-color: #fefce8;
                }
                .alt-row td {
                    background-color: #f8fafc;
                }
                .title-row {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1e293b;
                    padding: 10px 0;
                }
                .subtitle-row {
                    font-size: 11px;
                    color: #64748b;
                    padding: 5px 0;
                }
            </style>
        `;

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
                                <x:Name>Calibration Report</x:Name>
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
                        <td colspan="${months.length + 4}" class="title-row">
                            Annual Calibration Report - Caraga State University
                        </td>
                    </tr>
                    <tr>
                        <td colspan="${months.length + 4}" class="subtitle-row">
                            Generated on: ${new Date().toLocaleString()}
                        </td>
                    </tr>
                    <tr>
                        <th style="width: 200px; text-align: left;">Instrument Name/Eq.Code</th>
                        <th style="width: 120px;">Issued To</th>
                        <th style="width: 100px;">Frequency</th>
                        <th style="width: 80px;">Status</th>
                        ${months.map(month => 
                            `<th style="width: 60px;">${month.charAt(0).toUpperCase() + month.slice(1)}</th>`
                        ).join('')}
                    </tr>
        `;

        calibrations.forEach((calibration, index) => {
            const rowClass = index % 2 === 0 ? '' : 'class="alt-row"';
            
            excelContent += `
                <tr ${rowClass}>
                    <td class="instrument-cell" rowspan="3">${calibration.instrument_name_or_eq_code}</td>
                    <td class="info-cell" rowspan="3">${calibration.issued_to || '-'}</td>
                    <td class="info-cell" rowspan="3">${calibration.freq_of_cal || '-'}</td>
                    <td class="planned-header">Planned</td>
                    ${months.map(month => 
                        `<td class="planned-data">${getMonthValue(calibration, 'planned', month)}</td>`
                    ).join('')}
                </tr>
                
                <tr ${rowClass}>
                    <td class="actual-header">Actual</td>
                    ${months.map(month => 
                        `<td class="actual-data">${getMonthValue(calibration, 'actual', month)}</td>`
                    ).join('')}
                </tr>
                
                <tr ${rowClass}>
                    <td class="remarks-header">Remarks</td>
                    ${months.map(month => 
                        `<td class="remarks-data">${getMonthValue(calibration, 'remarks', month)}</td>`
                    ).join('')}
                </tr>
            `;
        });

        excelContent += `
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CSU_Calibration_Report_${new Date().toISOString().split('T')[0]}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Excel export completed');
    };

    const printReport = () => {
        if (calibrations.length === 0) {
            toast.warning('No calibration data to print');
            return;
        }

        const printWindow = window.open('', '', 'width=1200,height=800');
        if (!printWindow) {
            toast.error('Popup was blocked. Please allow popups for this site.');
            return;
        }

        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        printWindow.document.write(`
            <html>
                <head>
                    <title>Annual Calibration Report</title>
                    <style>
                        @page {
                            size: A4 landscape;
                            margin: 15mm;
                        }
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            margin: 0;
                            padding: 20px;
                            color: #1e293b;
                            font-size: 12px;
                            line-height: 1.4;
                        }
                        .report-header {
                            margin-bottom: 20px;
                            padding-bottom: 15px;
                            border-bottom: 2px solid #e5e7eb;
                        }
                        .report-title {
                            margin: 0;
                            font-size: 22px;
                            font-weight: 700;
                            color: #1e293b;
                        }
                        .report-subtitle {
                            margin: 4px 0 0;
                            font-size: 13px;
                            color: #64748b;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 10px 0 20px;
                            font-size: 11px;
                            page-break-inside: avoid;
                        }
                        th {
                            background-color: #1a5fb4;
                            color: white;
                            font-weight: bold;
                            text-align: center;
                            padding: 8px;
                            border: 1px solid #0b4491;
                        }
                        td {
                            padding: 8px;
                            border: 1px solid #e5e7eb;
                            text-align: center;
                        }
                        .instrument-cell {
                            font-weight: bold;
                            text-align: left;
                            background: white !important;
                            border-left: 1px solid #e5e7eb !important;
                        }
                        .info-cell {
                            background: white !important;
                        }
                        .planned-header {
                            background: #dbeafe !important;
                            color: #1d4ed8;
                            font-weight: bold;
                        }
                        .actual-header {
                            background: #dcfce7 !important;
                            color: #166534;
                            font-weight: bold;
                        }
                        .remarks-header {
                            background: #fef9c3 !important;
                            color: #713f12;
                            font-weight: bold;
                        }
                        .planned-data {
                            color: #1d4ed8;
                            background-color: #eff6ff;
                        }
                        .actual-data {
                            color: #166534;
                            background-color: #ecfdf5;
                        }
                        .remarks-data {
                            color: #713f12;
                            background-color: #fefce8;
                        }
                        .alt-row td {
                            background-color: #f8fafc;
                        }
                        .footer {
                            text-align: right;
                            font-size: 10px;
                            color: #64748b;
                            margin-top: 30px;
                            padding-top: 10px;
                            border-top: 1px solid #e2e8f0;
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
                    <div class="report-header">
                        <h1 class="report-title">Annual Calibration Report</h1>
                        <p class="report-subtitle">
                            <strong>Caraga State University</strong><br>
                            Generated on ${currentDate} | ${calibrations.length} instruments
                        </p>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 200px; text-align: left;">Instrument Name/Eq.Code</th>
                                <th style="width: 120px;">Issued To</th>
                                <th style="width: 100px;">Frequency</th>
                                <th style="width: 80px;">Status</th>
                                ${months.map(month => 
                                    `<th style="width: 60px;">${month.charAt(0).toUpperCase() + month.slice(1)}</th>`
                                ).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${calibrations.map((calibration, index) => {
                                const rowClass = index % 2 === 0 ? '' : 'class="alt-row"';
                                return `
                                    <tr ${rowClass}>
                                        <td class="instrument-cell" rowspan="3">${calibration.instrument_name_or_eq_code}</td>
                                        <td class="info-cell" rowspan="3">${calibration.issued_to || '-'}</td>
                                        <td class="info-cell" rowspan="3">${calibration.freq_of_cal || '-'}</td>
                                        <td class="planned-header">Planned</td>
                                        ${months.map(month => 
                                            `<td class="planned-data">${getMonthValue(calibration, 'planned', month)}</td>`
                                        ).join('')}
                                    </tr>
                                    <tr ${rowClass}>
                                        <td class="actual-header">Actual</td>
                                        ${months.map(month => 
                                            `<td class="actual-data">${getMonthValue(calibration, 'actual', month)}</td>`
                                        ).join('')}
                                    </tr>
                                    <tr ${rowClass}>
                                        <td class="remarks-header">Remarks</td>
                                        ${months.map(month => 
                                            `<td class="remarks-data">${getMonthValue(calibration, 'remarks', month)}</td>`
                                        ).join('')}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <div style="margin-top: 40px;">
                            <div class="signature-line"></div>
                            <div style="font-size: 11px; color: #475569;">Prepared by: CREATE & DABE - Inventory Management</div>
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
        toast.success('PDF report generated successfully');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calibration" />
            <Toaster position="top-right" richColors />
            <div className="p-4 sm:p-6 space-y-6">
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-semibold tracking-tight">Annual Calibration Management</CardTitle>
                            <CardDescription className="mt-1">
                                Efficiently plan, track, and manage your annual equipment calibration program to ensure accuracy, compliance, and operational reliability.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                onClick={exportCSV}
                                disabled={calibrations.length === 0 || isLoading}
                                className="gap-2"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                <span>Export Excel</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={printReport}
                                disabled={calibrations.length === 0 || isLoading}
                                className="gap-2"
                            >
                                <FileText className="h-4 w-4" />
                                <span>Export PDF</span>
                            </Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        <span>Add Calibration</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg">Add New Calibration</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="instrument_name_or_eq_code">
                                                Instrument Name/Eq. Code
                                            </Label>
                                            <Input
                                                id="instrument_name_or_eq_code"
                                                name="instrument_name_or_eq_code"
                                                value={formData.instrument_name_or_eq_code}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter instrument name or code"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="issued_to">
                                                Issued To
                                            </Label>
                                            <Input
                                                id="issued_to"
                                                name="issued_to"
                                                value={formData.issued_to}
                                                onChange={handleInputChange}
                                                placeholder="Enter department or person"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="freq_of_cal">
                                                Frequency of Calibration
                                            </Label>
                                            <Input
                                                id="freq_of_cal"
                                                name="freq_of_cal"
                                                value={formData.freq_of_cal}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Quarterly, Annually"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit">
                                                Save
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                    <div className="relative overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[200px] font-medium border-r">Instrument Name/Eq.Code</TableHead>
                                    <TableHead className="w-[120px] font-medium border-r">Issued to</TableHead>
                                    <TableHead className="w-[180px] font-medium border-r">Frequency of Calibration</TableHead>
                                    <TableHead className="w-[80px] font-medium border-r">Status</TableHead>
                                    {months.map(month => (
                                        <TableHead key={month} className="w-[60px] font-medium text-center border-r">
                                            {month.charAt(0).toUpperCase() + month.slice(1)}
                                        </TableHead>
                                    ))}
                                    <TableHead className="w-[80px] font-medium border-r">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={16} className="text-center py-8">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : calibrations.length > 0 ? (
                                    calibrations.map((calibration) => (
                                        <>
                                            {/* Main row with instrument info */}
                                            <TableRow key={`${calibration.id}-main`} className="hover:bg-gray-50/50">
                                                <TableCell className="font-medium border-r" rowSpan={3}>
                                                    {calibration.instrument_name_or_eq_code}
                                                </TableCell>
                                                <TableCell className="border-r" rowSpan={3}>
                                                    {calibration.issued_to}
                                                </TableCell>
                                                <TableCell className="border-r" rowSpan={3}>
                                                    {calibration.freq_of_cal}
                                                </TableCell>
                                                <TableCell className="text-xs border-r bg-blue-50">
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                                                        onClick={() => openStatusDialog(calibration, 'planned')}
                                                    >
                                                        Planned
                                                    </Button>
                                                </TableCell>
                                                {months.map(month => (
                                                    <TableCell 
                                                        key={`${calibration.id}-planned-${month}`} 
                                                        className="text-center border-r bg-blue-50"
                                                    >
                                                        {getMonthValue(calibration, 'planned', month)}
                                                    </TableCell>
                                                ))}
                                                <TableCell className="border-r" rowSpan={3}>
                                                    <div className="flex space-x-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => openEditDialog(calibration)}
                                                            className="text-gray-600 hover:text-gray-900"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => handleDelete(calibration.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            
                                            {/* Actual row */}
                                            <TableRow key={`${calibration.id}-actual`} className="hover:bg-gray-50/50">
                                                <TableCell className="text-xs border-r bg-green-50">
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
                                                        onClick={() => openStatusDialog(calibration, 'actual')}
                                                    >
                                                        Actual
                                                    </Button>
                                                </TableCell>
                                                {months.map(month => (
                                                    <TableCell 
                                                        key={`${calibration.id}-actual-${month}`} 
                                                        className="text-center border-r bg-green-50"
                                                    >
                                                        {getMonthValue(calibration, 'actual', month)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                            
                                            {/* Remarks row */}
                                            <TableRow key={`${calibration.id}-remarks`} className="hover:bg-gray-50/50">
                                                <TableCell className="text-xs border-r bg-yellow-50">
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-6 px-2 text-xs text-yellow-600 hover:text-yellow-700"
                                                        onClick={() => openStatusDialog(calibration, 'remarks')}
                                                    >
                                                        Remarks
                                                    </Button>
                                                </TableCell>
                                                {months.map(month => (
                                                    <TableCell 
                                                        key={`${calibration.id}-remarks-${month}`} 
                                                        className="text-center border-r bg-yellow-50"
                                                    >
                                                        {getMonthValue(calibration, 'remarks', month)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={16} className="text-center py-8 text-gray-500">
                                            No calibration records found. Add your first calibration record to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Status Update Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            Update {currentField === 'planned' ? 'Planned' : 
                                  currentField === 'actual' ? 'Actual' : 'Remarks'} Status
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-2">
                        <div>
                            <Label className="mb-3 block">Select Months</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {months.map(month => (
                                    <div key={month} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`month-${month}`}
                                            checked={selectedMonths[month] || false}
                                            onCheckedChange={() => toggleMonthSelection(month)}
                                        />
                                        <Label htmlFor={`month-${month}`} className="text-sm font-normal">
                                            {month.charAt(0).toUpperCase() + month.slice(1)}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {currentField !== 'remarks' ? (
                            <div className="space-y-2">
                                <Label htmlFor="status-value">
                                    {currentField === 'planned' ? 'Planned Status' : 'Actual Status'}
                                </Label>
                                <Input
                                    id="status-value"
                                    value={statusValue}
                                    onChange={(e) => setStatusValue(e.target.value)}
                                    placeholder={currentField === 'planned' ? 'Enter planned status' : 'Enter actual status'}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="remarks-value">
                                    Remarks
                                </Label>
                                <Input
                                    id="remarks-value"
                                    value={remarksValue}
                                    onChange={(e) => setRemarksValue(e.target.value)}
                                    placeholder="Enter remarks or notes"
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsStatusDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleStatusSubmit}
                            disabled={
                                (currentField !== 'remarks' && !statusValue) || 
                                (currentField === 'remarks' && !remarksValue) ||
                                Object.values(selectedMonths).filter(Boolean).length === 0
                            }
                        >
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Edit Calibration</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-instrument_name_or_eq_code">
                                Instrument Name/Eq. Code
                            </Label>
                            <Input
                                id="edit-instrument_name_or_eq_code"
                                name="instrument_name_or_eq_code"
                                value={formData.instrument_name_or_eq_code}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter instrument name or code"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-issued_to">
                                Issued To
                            </Label>
                            <Input
                                id="edit-issued_to"
                                name="issued_to"
                                value={formData.issued_to}
                                onChange={handleInputChange}
                                placeholder="Enter department or person"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-freq_of_cal">
                                Frequency of Calibration
                            </Label>
                            <Input
                                id="edit-freq_of_cal"
                                name="freq_of_cal"
                                value={formData.freq_of_cal}
                                onChange={handleInputChange}
                                placeholder="e.g. Quarterly, Annually"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}