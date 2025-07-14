import { useEffect, useState } from "react";
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import axios from "axios";
import { 
  Package2, Layers3, ListChecks, ArrowUpRight, ArrowDownLeft, 
  AlertCircle, Clock, CalendarCheck, Search, Activity, AlertTriangle,
  PlusCircle, FileText, Bell, MessageSquare,
  Check, TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Inventory Management', href: '/dashboard' },
];

type Category = {
    id: number;
    name: string;
    inventories_count: number;
};

type InventoryItem = {
    id: number;
    category?: { id: number; name: string };
    equipment_name: string;
    serial_number: string;
    date_acquired: string;
    notes?: string;
    remarks: string; // "Functional" or "Non-Functional"
    office?: { id: number; office_name: string };
    warranty_expiry?: string;
    last_maintenance?: string;
    next_maintenance?: string;
};

type Office = {
    id: number;
    office_name: string;
    inventories_count: number;
};

type MaintenanceItem = {
    id: number;
    inventory_id: number;
    equipment_name: string;
    maintenance_date: string;
    next_maintenance_date: string;
    status: 'completed' | 'pending' | 'overdue';
};

export default function Dashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [offices, setOffices] = useState<Office[]>([]);
    const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchInventory();
        fetchOffices();
    }, []);

    const fetchCategories = async () => {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
    };

    const fetchInventory = async () => {
        const res = await axios.get('/api/inventory');
        setInventory(res.data);
    };

    const fetchOffices = async () => {
        const res = await axios.get('/api/offices');
        setOffices(res.data);
    };

    // Quick stats
    const totalCategories = categories.length;
    const totalItems = inventory.length;

    // Count functional and non-functional equipment
    const functionalCount = inventory.filter(i => i.remarks !== "Non-Functional").length;
    const nonFunctionalCount = inventory.filter(i => i.remarks === "Non-Functional").length;
    const functionalPercent = totalItems > 0 ? Math.round((functionalCount / totalItems) * 100) : 0;
    const nonFunctionalPercent = totalItems > 0 ? Math.round((nonFunctionalCount / totalItems) * 100) : 0;

    // Group non-functional equipment by office
    const nonFunctionalByOffice: { [officeName: string]: number } = {};
    inventory.forEach(i => {
        if (i.remarks === "Non-Functional") {
            const office = i.office?.office_name || "No Office";
            nonFunctionalByOffice[office] = (nonFunctionalByOffice[office] || 0) + 1;
        }
    });

    // Group functional equipment by office
    const functionalByOffice: { [officeName: string]: number } = {};
    inventory.forEach(i => {
        if (i.remarks !== "Non-Functional") {
            const office = i.office?.office_name || "No Office";
            functionalByOffice[office] = (functionalByOffice[office] || 0) + 1;
        }
    });

    // Recent items (last 5)
    const recentItems = [...inventory]
        .sort((a, b) => new Date(b.date_acquired).getTime() - new Date(a.date_acquired).getTime())
        .slice(0, 5);

    // Track changes
    const [lastTotalItems, setLastTotalItems] = useState<number | null>(null);
    const [lastTotalCategories, setLastTotalCategories] = useState<number | null>(null);

    useEffect(() => {
        if (lastTotalItems === null) setLastTotalItems(totalItems);
        if (lastTotalCategories === null) setLastTotalCategories(totalCategories);
    }, []);

    useEffect(() => {
        if (lastTotalItems !== null && totalItems !== lastTotalItems) {
            setLastTotalItems(totalItems);
        }
        if (lastTotalCategories !== null && totalCategories !== lastTotalCategories) {
            setLastTotalCategories(totalCategories);
        }
    }, [totalItems, totalCategories]);

    const equipmentDiff = lastTotalItems !== null ? totalItems - lastTotalItems : 0;
    const categoriesDiff = lastTotalCategories !== null ? totalCategories - lastTotalCategories : 0;

    // Warranty expiring soon (within 90 days)
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);
    
    const expiringWarrantyItems = inventory.filter(item => {
        if (!item.warranty_expiry) return false;
        const expiryDate = new Date(item.warranty_expiry);
        return expiryDate > today && expiryDate <= ninetyDaysFromNow;
    });

    // Maintenance status
    const overdueMaintenance = maintenanceItems.filter(item => {
        const dueDate = new Date(item.next_maintenance_date);
        return dueDate < today && item.status !== 'completed';
    });

    // Category distribution data for the chart
    const categoryChartData = categories.map(category => ({
        name: category.name,
        count: category.inventories_count,
    }));

    // Chart configuration
    const chartConfig = {
        count: {
            label: "Equipment Count",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-8 space-y-8">
                
                {/* Status Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <div className="bg-purple-100 text-purple-700 rounded-full p-2">
                                <Package2 className="w-6 h-6" />
                            </div>
                            <CardTitle>Total Equipment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="text-3xl font-bold">{totalItems}</div>
                                {equipmentDiff > 0 && (
                                    <span className="flex items-center text-green-600 text-sm font-semibold">
                                        <ArrowUpRight className="w-4 h-4 mr-0.5" />+{equipmentDiff}
                                    </span>
                                )}
                                {equipmentDiff < 0 && (
                                    <span className="flex items-center text-red-600 text-sm font-semibold">
                                        <ArrowDownLeft className="w-4 h-4 mr-0.5" />{equipmentDiff}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <div className="bg-blue-100 text-blue-700 rounded-full p-2">
                                <Layers3 className="w-6 h-6" />
                            </div>
                            <CardTitle>Total Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="text-3xl font-bold">{totalCategories}</div>
                                {categoriesDiff > 0 && (
                                    <span className="flex items-center text-green-600 text-sm font-semibold">
                                        <ArrowUpRight className="w-4 h-4 mr-0.5" />+{categoriesDiff}
                                    </span>
                                )}
                                {categoriesDiff < 0 && (
                                    <span className="flex items-center text-red-600 text-sm font-semibold">
                                        <ArrowDownLeft className="w-4 h-4 mr-0.5" />{categoriesDiff}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <div className="bg-green-100 text-green-700 rounded-full p-2">
                                <ListChecks className="w-6 h-6" />
                            </div>
                            <CardTitle>Functional Equipment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{functionalCount}</div>
                            <Progress value={functionalPercent} className="h-2 mt-2" />
                            <div className="text-sm text-muted-foreground mt-1">{functionalPercent}% of total</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <div className="bg-red-100 text-red-700 rounded-full p-2">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <CardTitle>Non-Functional</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{nonFunctionalCount}</div>
                            <Progress value={nonFunctionalPercent} className="h-2 mt-2 bg-red-100" />
                            <div className="text-sm text-muted-foreground mt-1">{nonFunctionalPercent}% of total</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Second Row: Alerts and Maintenance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Category Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="bg-purple-100 text-purple-700 rounded-full p-2">
                                    <Activity className="w-6 h-6" />
                                </div>
                                Category Distribution
                            </CardTitle>
                            <CardDescription>
                                Showing equipment count by category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {categoryChartData.length === 0 ? (
                                <div className="text-center text-muted-foreground py-4">
                                    No categories found
                                </div>
                            ) : (
                                <ChartContainer config={chartConfig}>
                                    <AreaChart
                                        accessibilityLayer
                                        data={categoryChartData}
                                        margin={{
                                            left: 12,
                                            right: 12,
                                        }}
                                        height={200}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <defs>
                                            <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="var(--chart-1)"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="var(--chart-1)"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            dataKey="count"
                                            type="natural"
                                            fill="url(#fillCount)"
                                            fillOpacity={0.4}
                                            stroke="var(--chart-1)"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                        <CardFooter>
                            <div className="flex w-full items-start gap-2 text-sm">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 leading-none font-medium">
                                        {categoriesDiff > 0 ? (
                                            <>
                                                Trending up by {categoriesDiff} categories <TrendingUp className="h-4 w-4" />
                                            </>
                                        ) : categoriesDiff < 0 ? (
                                            <>
                                                Trending down by {Math.abs(categoriesDiff)} categories <TrendingUp className="h-4 w-4 rotate-180" />
                                            </>
                                        ) : (
                                            "No change in categories"
                                        )}
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                        Total of {totalCategories} categories
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                    {/* Recently Added Equipment */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Recently Added Equipment</h2>
                            <Button variant="outline" size="sm" asChild>
                                <a href="/inventory">View All</a>
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Equipment Name</TableHead>
                                    <TableHead>Serial Number</TableHead>
                                    <TableHead>Date Acquired</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                                            No recent equipment.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.equipment_name}</TableCell>
                                            <TableCell>{item.serial_number}</TableCell>
                                            <TableCell>{item.date_acquired}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.remarks === "Non-Functional" ? "destructive" : "default"}>
                                                    {item.remarks === "Non-Functional" ? "Non-Functional" : "Functional"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}