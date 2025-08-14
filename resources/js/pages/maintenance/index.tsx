import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory Management', href: '/dashboard' },
    { title: 'Maintenance', href: '/maintenance' },
];

export default function Maintenance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maintenance" />
            <Toaster position="top-right" richColors />

            <div className="p-4 sm:p-6 space-y-6">
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-semibold tracking-tight">
                                Maintenance Management
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Manage your maintenance tasks and schedules efficiently.
                            </CardDescription>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <Card className="overflow-x-auto shadow-sm border">
                    <CardContent className="p-4">
                        <Table>
                <TableHeader>
                    {/* First row spanning all columns */}
                    <TableRow>
                        <TableHead
                            colSpan={3}
                            className="text-center font-semibold text-lg border bg-gray-50"
                        >
                            Based on the Inventory of ABE Equipment (As of June 2024)
                        </TableHead>
                        <TableHead
                            colSpan={3}
                            className="text-center font-semibold text-lg border bg-gray-50"
                        >
                            
                        </TableHead>
                    </TableRow>

                    {/* Second row with actual headers */}
                    <TableRow>
                        <TableHead className="border">EXISTING EQUIPMENT</TableHead>
                        <TableHead className="border">NUMBER OF AVAILABLE UNITS</TableHead>
                        <TableHead className="border">Update in July 2025</TableHead>
                        <TableHead className="border">Remarks</TableHead>
                        <TableHead className="border">Remark (Maintenance Schedule)</TableHead>
                        <TableHead className="border">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                        <TableBody>
                            <TableRow>
                                <TableCell className="border">Sample Equipment</TableCell>
                                <TableCell className="border">5</TableCell>
                                <TableCell className="border">Updated</TableCell>
                                <TableCell className="border">2 - Functional</TableCell>
                                <TableCell className="border">N/A</TableCell>
                                <TableCell className="border space-x-2">
                                    <button className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                                        Edit
                                    </button>
                                    <button className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                                        Delete
                                    </button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
);
}
