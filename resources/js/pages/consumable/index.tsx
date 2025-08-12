import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory Management', href: '/dashboard' },
    { title: 'Consumable', href: '/consumable' },
];

export default function Consumable() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Consumable" />
            <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                        Page Not Available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        The maintenance page is currently unavailable. Please check back later.
                    </p>
                    <div className="mt-6">
                        <a
                            href="/dashboard"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Return to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
