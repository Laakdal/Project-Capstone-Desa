import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';

export default function UserEdit({ user }) {
    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Edit User" />
            
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <Topbar pageTitle="Edit User" />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800">Edit User Form</h2>
                        <p className="text-gray-600 mt-2">Form untuk mengedit user akan ditambahkan di sini.</p>
                        
                        {/* User data preview */}
                        {user && (
                            <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold mb-2">User Data:</h3>
                                <pre className="text-sm text-gray-600">
                                    {JSON.stringify(user, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
