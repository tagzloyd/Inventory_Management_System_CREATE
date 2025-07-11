import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] } ) {
    const page = usePage();
    
    return (
        <SidebarGroup className="px-2 py-0">
            {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => (
                    <NavItemComponent 
                        key={item.href} 
                        item={item} 
                        page={page} 
                    />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function NavItemComponent({ item, page }: { item: NavItem, page: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = item.isActive ?? page.url.startsWith(item.href);

    return (
        <>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    tooltip={{ children: item.title }}
                    onClick={() => hasSubmenu && setIsOpen(!isOpen)}
                >
                    <div className="flex w-full items-center justify-between">
                        <Link href={hasSubmenu ? '#' : item.href} prefetch className="flex-1">
                            <div className="flex items-center gap-2">
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span>{item.title}</span>
                            </div>
                        </Link>
                        {hasSubmenu && (
                            <span className="ml-2">
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </span>
                        )}
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>

            {hasSubmenu && isOpen && (
                <div className="ml-4 border-l border-gray-200 pl-2">
                    <SidebarMenu>
                        {item.submenu?.map((subItem) => (
                            <SidebarMenuItem key={subItem.href}>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={page.url.startsWith(subItem.href)}
                                    tooltip={{ children: subItem.title }}
                                >
                                    <Link href={subItem.href} prefetch className="pl-6">
                                        <div className="flex items-center gap-2">
                                            {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                            <span>{subItem.title}</span>
                                        </div>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </div>
            )}
        </>
    );
}