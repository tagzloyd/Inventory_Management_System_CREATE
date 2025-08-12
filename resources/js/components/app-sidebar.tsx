import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { BookMarkedIcon, BookOpen, BoxIcon, Calendar1Icon, CalendarArrowDown, CalendarClockIcon, Circle, CogIcon, Folder, LayoutGrid, LucidePersonStanding, PanelBottom, PanelTopCloseIcon, PersonStanding, ReceiptPoundSterlingIcon, TruckIcon, Warehouse, WarehouseIcon, ChevronDown, ChevronUp, GlassWaterIcon, LucideGlasses, MicroscopeIcon, LucideWarehouse, Wrench, WrenchIcon, ConstructionIcon } from 'lucide-react';
import AppLogo from './app-logo';
import { NavGroup } from '@/types';
import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

const mainNavItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Office/Categories',
        href: '/categories',
        icon: Folder,
    },
    {
        title: 'Faculties',
        href: '/faculty',
        icon: PersonStanding,
    }
];

const thirdNavItems = [
    {
        title: 'Records',
        href: '/records',
        icon: BookMarkedIcon,
    },
    {
        title: 'Calendar',
        href: '/schedule',
        icon: CalendarClockIcon,
    }
];

const secondaryNavItems: NavGroup[] = [
    {
        title: 'Equipment',
        items: [  
            {
                title:  'Inventory',
                href: '/inventory',
                icon: WarehouseIcon,
            },
            {
                title:  'Calibration',
                href: '/calibration',
                icon: WrenchIcon,
            },
            {
                title:  'Maintenance',
                href: '/maintenance',
                icon: ConstructionIcon,
            },
            {
                title:  'Consumable',
                href: '/consumable',
                icon: GlassWaterIcon,
            }
            
        ],
        icon: LucideWarehouse,
    }
];

export function AppSidebar() {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        'Equipment': false, // Set default open groups here
        'Reports': false
    });

    const toggleGroup = (groupTitle: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [groupTitle]: !prev[groupTitle]
        }));
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <SidebarMenu>
                    {secondaryNavItems.map((group) => (
                        <Collapsible 
                            key={group.title}
                            open={openGroups[group.title]} 
                            onOpenChange={() => toggleGroup(group.title)}
                            className="w-full"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton className="w-full justify-between">
                                     <div className='font-medium m-2'> {group.title}</div>
                                        {openGroups[group.title] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                            </SidebarMenuItem>
                            <CollapsibleContent>
                                <NavMain items={group.items} />
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </SidebarMenu>
                
                {/* Divider added here */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                
                <NavMain items={thirdNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}