
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookMarkedIcon, BookOpen, BoxIcon, Calendar1Icon, CalendarArrowDown, CalendarClockIcon, Circle, CogIcon, Folder, LayoutGrid, LucidePersonStanding, PanelBottom, PanelTopCloseIcon, PersonStanding, ReceiptPoundSterlingIcon, TruckIcon, Warehouse, WarehouseIcon } from 'lucide-react';
import AppLogo from './app-logo';
import { NavGroup } from '@/types';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Office/Categories',
//         href: '/categories',
//         icon: Folder
//     },
//     {
//         title: 'Records',
//         href: '/records',
//         icon: BookOpen
//     }
// ];
const secondaryNavItems: NavGroup[] = [
    {
        title: 'Main',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            }
        ],
    },
    {
        title: 'Inventory',
        items: [            
            {
                title: 'Office/Categories',
                href: '/categories',
                icon: Folder,
            },
            {
                title:  'Equipments',
                href: '/inventory',
                icon: WarehouseIcon,
            },
            {
                title: 'Faculties',
                href: '/faculty',
                icon: PersonStanding,
            }
        ],
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
                
                <SidebarMenu>
                    {secondaryNavItems.map((group) => (
                        <SidebarMenuItem key={group.title}>
                            <SidebarMenuButton>
                                {group.title}
                            </SidebarMenuButton>
                            <NavMain items={group.items} />
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                {/* <NavMain items={mainNavItems} /> */}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}