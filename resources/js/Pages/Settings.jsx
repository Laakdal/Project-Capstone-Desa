import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';

export default function Settings({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <SettingsIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Pengaturan
                    </h2>
                </div>
            }
        >
            <Head title="Pengaturan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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

                        {/* System Settings */}
                        {(auth.user.user_role?.name === 'Sekretaris Desa' || auth.user.user_role?.name === 'Kepala Desa') && (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Database className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Pengaturan Sistem
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Konfigurasi sistem dan data master
                                    </p>
                                    <button
                                        disabled
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-600 uppercase tracking-widest cursor-not-allowed"
                                    >
                                        Segera Hadir
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
