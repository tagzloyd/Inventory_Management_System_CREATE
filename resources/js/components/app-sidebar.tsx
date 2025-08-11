import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { BookMarkedIcon, BookOpen, BoxIcon, Calendar1Icon, CalendarArrowDown, CalendarClockIcon, Circle, CogIcon, Folder, LayoutGrid, LucidePersonStanding, PanelBottom, PanelTopCloseIcon, PersonStanding, ReceiptPoundSterlingIcon, TruckIcon, Warehouse, WarehouseIcon, ChevronDown, ChevronUp, GlassWaterIcon, LucideGlasses, MicroscopeIcon, LucideWarehouse } from 'lucide-react';
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
                title:  'Laboratory',
                href: '/laboratory',
                icon: MicroscopeIcon,
            }
            
        ],
        icon: LucideWarehouse,
    },
    {
        title: 'Reports',
        items: [
            {
                title: 'Records',
                href: '/records',
                icon: BookMarkedIcon,
            },
        ],
    },
    {
        title: 'Schedules',
        items: [
            {
                title: 'Calendar',
                href: '/schedule',
                icon: CalendarClockIcon,
            },
        ],
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
                                        <span>{group.title}</span>
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
               
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}