import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="CSU Inventory Login" />
            
            {/* CSU Header
            <div className="bg-[#0C4B33] text-white py-2 px-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-sm">
                        Caraga State University
                    </div>
                    <div className="flex space-x-4 text-sm">
                        <a href="https://www.carsu.edu.ph/" className="hover:underline">CSU Main Website</a>
                    </div>
                </div>
            </div> */}

            <AuthLayout 
                title="Welcome to Inventory Management System"
                description="Please log in to continue."
            >
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                    <form className="flex flex-col gap-4" onSubmit={submit}>
                        <div className="flex justify-center mb-4">
                            <img 
                                src="/images/CSU-logo.png" 
                                alt="CSU Logo" 
                                className="h-16"
                            />
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-[#0C4B33]">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    className="border-[#0C4B33] focus:ring-[#0C4B33]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-[#0C4B33]">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    className="border-[#0C4B33] focus:ring-[#0C4B33]"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                    className="border-[#0C4B33] text-[#0C4B33] focus:ring-[#0C4B33]"
                                />
                                <Label htmlFor="remember" className="text-[#0C4B33]">Remember me</Label>
                            </div>

                            <Button 
                                type="submit" 
                                className="mt-4 w-full bg-[#0C4B33] hover:bg-[#0D5A3D] focus-visible:ring-[#0C4B33]"
                                tabIndex={4} 
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Log in
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Caraga State University. All rights reserved.
                </div>
            </AuthLayout>
        </>
    );
}