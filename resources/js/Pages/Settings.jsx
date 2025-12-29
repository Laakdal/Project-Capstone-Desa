import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';

export default function Settings({ auth }) {
    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Pengaturan" />

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <SettingsIcon className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
                        </div>
                        <p className="text-gray-600">
                            Kelola pengaturan akun dan sistem Anda
                        </p>
                    </div>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Settings */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Profil Pengguna
                                    </h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Kelola informasi profil dan akun Anda
                                </p>
                                <a
                                    href={route('profile.edit')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Edit Profil
                                </a>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Bell className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Notifikasi
                                    </h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Atur preferensi notifikasi Anda
                                </p>
                                <button
                                    disabled
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-600 uppercase tracking-widest cursor-not-allowed"
                                >
                                    Segera Hadir
                                </button>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Shield className="w-6 h-6 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Keamanan
                                    </h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Kelola kata sandi dan keamanan akun
                                </p>
                                <button
                                    disabled
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-600 uppercase tracking-widest cursor-not-allowed"
                                >
                                    Segera Hadir
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
