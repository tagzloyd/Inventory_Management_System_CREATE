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
  PlusCircle, FileText, Bell, MessageSquare, Wrench, Construction,
  Check, TrendingUp, ChevronRight, Filter, Download, MoreHorizontal
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
    remarks: "Functional" | "Non-Functional" | "Under Repair" | "Defective";
    office?: { id: number; office_name: string };
    warranty_expiry?: string;
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
    notes: string;
};

export default function Dashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [offices, setOffices] = useState<Office[]>([]);
    const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await Promise.all([
                    fetchCategories(),
                    fetchInventory(),
                    fetchOffices(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
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

    // Count equipment by status
    const functionalCount = inventory.filter(i => i.remarks === "Functional").length;
    const nonFunctionalCount = inventory.filter(i => i.remarks === "Non-Functional").length;
    const underRepairCount = inventory.filter(i => i.remarks === "Under Repair").length;
    const defectiveCount = inventory.filter(i => i.remarks === "Defective").length;
    
    const functionalPercent = totalItems > 0 ? Math.round((functionalCount / totalItems) * 100) : 0;
    // const nonFunctionalPercent = totalItems > 0 ? Math.round((nonFunctionalCount / totalItems) * 100) : 0;
    // const underRepairPercent = totalItems > 0 ? Math.round((underRepairCount / totalItems) * 100) : 0;
    // const defectivePercent = totalItems > 0 ? Math.round((defectiveCount / totalItems) * 100) : 0;

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

    // Recent items (last 5)
    const recentItems = [...inventory]
        .sort((a, b) => new Date(b.date_acquired).getTime() - new Date(a.date_acquired).getTime())
        .slice(0, 5);

    // Category distribution data for the chart
    const categoryChartData = categories.map(category => ({
        name: category.name,
        count: category.inventories_count,
    }));

    // Status distribution data for the chart
    const statusChartData = [
        { name: 'Functional', value: functionalCount, color: 'bg-emerald-500' },
        { name: 'Non-Functional', value: nonFunctionalCount, color: 'bg-red-500' },
        { name: 'Under Repair', value: underRepairCount, color: 'bg-yellow-500' },
        { name: 'Defective', value: defectiveCount, color: 'bg-orange-500' },
    ];

    // Chart configuration
    const chartConfig = {
        count: {
            label: "Equipment Count",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig;

    // Status badge variants
    const statusBadgeVariants = {
        "Functional": "default",
        "Non-Functional": "destructive",
        "Under Repair": "secondary",
        "Defective": "outline"
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">Inventory Dashboard</CardTitle>
                        <CardDescription className="mt-1">
                        Overview of your equipment inventory
                        </CardDescription>
                    </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <nav className="flex space-x-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={cn(
                                "py-3 px-1 border-b-2 font-medium text-sm",
                                activeTab === 'overview'
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Overview
                        </button>
                    </nav>
                </div>

                {isLoading ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-xl" />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Skeleton className="h-80 rounded-xl" />
                            <Skeleton className="h-80 rounded-xl lg:col-span-2" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Status Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Equipment
                                    </CardTitle>
                                    <Package2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalItems}</div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        {equipmentDiff > 0 ? (
                                            <span className="flex items-center text-green-600">
                                                <ArrowUpRight className="w-3 h-3 mr-1" />+{equipmentDiff} from last month
                                            </span>
                                        ) : equipmentDiff < 0 ? (
                                            <span className="flex items-center text-red-600">
                                                <ArrowDownLeft className="w-3 h-3 mr-1" />{equipmentDiff} from last month
                                            </span>
                                        ) : (
                                            "No change from last month"
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Categories
                                    </CardTitle>
                                    <Layers3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalCategories}</div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        {categoriesDiff > 0 ? (
                                            <span className="flex items-center text-green-600">
                                                <ArrowUpRight className="w-3 h-3 mr-1" />+{categoriesDiff} from last month
                                            </span>
                                        ) : categoriesDiff < 0 ? (
                                            <span className="flex items-center text-red-600">
                                                <ArrowDownLeft className="w-3 h-3 mr-1" />{categoriesDiff} from last month
                                            </span>
                                        ) : (
                                            "No change from last month"
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Functional Equipment
                                    </CardTitle>
                                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{functionalCount}</div>
                                    <Progress value={functionalPercent} className="h-2 mt-2" />
                                    <div className="text-xs text-muted-foreground mt-1">{functionalPercent}% of total inventory</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Issues Reported
                                    </CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{nonFunctionalCount + underRepairCount + defectiveCount}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                            {nonFunctionalCount} Non-Functional
                                        </Badge>
                                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                            {underRepairCount} Under Repair
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts and Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Category Distribution */}
                            <Card className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Category Distribution</CardTitle>
                                    <CardDescription>Equipment count by category</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    {categoryChartData.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            No category data available
                                        </div>
                                    ) : (
                                        <div className="h-[250px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={categoryChartData}
                                                    margin={{
                                                        top: 10,
                                                        right: 10,
                                                        left: 0,
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis 
                                                        dataKey="name" 
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tick={{ fontSize: 12 }}
                                                        tickFormatter={(value) => value.length > 8 ? `${value.substring(0, 6)}...` : value}
                                                    />
                                                    <YAxis 
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tick={{ fontSize: 12 }}
                                                    />
                                                    <ChartTooltip />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="count" 
                                                        stroke="#8884d8" 
                                                        fill="#8884d8"
                                                        fillOpacity={0.2}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Status Distribution */}
                            <Card className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
                                    <CardDescription>Equipment condition overview</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="space-y-4">
                                        {statusChartData.map((status) => (
                                            <div key={status.name} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">{status.name}</span>
                                                    <span className="text-sm font-medium">{status.value}</span>
                                                </div>
                                                <Progress 
                                                    value={(status.value / totalItems) * 100} 
                                                    className={`h-2 ${status.color.replace('bg', 'bg-opacity-20')}`}
                                                    // indicatorClassName={status.color}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="flex flex-col lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                                    <CardDescription>Latest inventory changes</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 p-0">
                                    <div className=" p-6">
                                            <div className="space-y-4">
                                                {recentItems.length === 0 ? (
                                                    <div className="text-center text-muted-foreground py-4">
                                                        No recent equipment added
                                                    </div>
                                                ) : (
                                                    recentItems.map((item) => (
                                                        <div key={item.id} className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium">{item.equipment_name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Date Acquired {formatDate(item.date_acquired)}
                                                                </p>
                                                            </div>
                                                            <Badge variant={statusBadgeVariants[item.remarks] as "default" | "outline" | "destructive" | "secondary"}>
                                                                {item.remarks}
                                                            </Badge>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Equipment and Alerts */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            {/* Equipment by Office */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Equipment by Office</CardTitle>
                                    <CardDescription>Distribution across departments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Office</TableHead>
                                                <TableHead className="text-right">Functional</TableHead>
                                                <TableHead className="text-right">Issues</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {offices.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                                                        No office data available
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                offices.map((office) => {
                                                    const functional = inventory.filter(
                                                        i => i.office?.id === office.id && i.remarks === "Functional"
                                                    ).length;
                                                    const issues = inventory.filter(
                                                        i => i.office?.id === office.id && i.remarks !== "Functional"
                                                    ).length;
                                                    
                                                    return (
                                                        <TableRow key={office.id}>
                                                            <TableCell className="font-medium">{office.office_name}</TableCell>
                                                            <TableCell className="text-right">
                                                                <span className="text-emerald-600">{functional}</span>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <span className="text-red-600">{issues}</span>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}