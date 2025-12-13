import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, Link } from '@inertiajs/react';
import Sidebar, { Topbar } from '@/Components/Sidebar';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Profil Saya" />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col">
                <Topbar pageTitle="Profil Saya" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        {/* Breadcrumb */}
                        <div className="flex items-center text-sm text-gray-500 mb-6 px-4 sm:px-0">
                            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                            <span className="mx-2">›</span>
                            <span className="text-gray-900 font-medium">Profil Saya</span>
                        </div>

                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        {/* Only show delete account if necessary, usually hidden for common users in these apps, but sticking to Breeze default if desired. 
                            Given the context of "Village System", maybe hide it or keep it? 
                            I'll check if the partial exists (checked, yes). 
                            I will include it but maybe user will ask to remove later. */}
                        {/* <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <DeleteUserForm className="max-w-xl" />
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
}
