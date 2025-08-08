import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="CSU Inventory Login">
                <link rel="icon" href="/favicon.ico" />
            </Head>           
            {/* Main Content - Centered Login */}
            <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <img 
                            src="/images/CSU-logo.png" 
                            alt="CSU Logo" 
                            className="h-50 w-30 mb-4"
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-[#0C4B33]">
                        Inventory Management System
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Sign in to your account</h3>
                        </div>
                        
                        <Link
                            href={route('login')}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0C4B33] hover:bg-[#0D5A3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C4B33]"
                        >
                            Login
                        </Link>
                        
                        <div className="mt-4 text-center text-sm text-gray-600">
                            Contact the administrator if you need access to the system
                        </div>
                    </div>
                    
                    <div className="mt-4 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} Caraga State University. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}