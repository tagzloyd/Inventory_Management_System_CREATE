import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: '/inventory',
    },
];

export default function InventoryIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

        </AppLayout>
    );
}
