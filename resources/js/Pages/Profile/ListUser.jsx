import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { Search, Plus, Edit2, Trash2, Users, UserCheck, Crown, Briefcase } from 'lucide-react';
import { useState } from 'react';

export default function ListUser({ users: initialUsers = [], statistics = {} }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Use users from props (from database)
    const users = initialUsers;

    // Helper function to get role color
    const getRoleColor = (role) => {
        switch (role) {
            case 'Kepala Desa':
                return 'bg-purple-100 text-purple-700';
            case 'Sekretaris Desa':
                return 'bg-blue-100 text-blue-700';
            case 'Pegawai Desa':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        return status === 'Aktif'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700';
    };

    // Statistics cards - use data from backend or show '-'
    const stats = [
        {
            label: 'Total Pengguna',
            value: statistics?.total_users ?? '-',
            icon: Users,
            color: 'bg-blue-50 text-blue-600',
            iconBg: 'bg-blue-100'
        },
        {
            label: 'Pengguna Aktif',
            value: statistics?.active_users ?? '-',
            icon: UserCheck,
            color: 'bg-green-50 text-green-600',
            iconBg: 'bg-green-100'
        },
        {
            label: 'Kepala Desa',
            value: statistics?.kepala_desa ?? '-',
            icon: Crown,
            color: 'bg-purple-50 text-purple-600',
            iconBg: 'bg-purple-100'
        },
        {
            label: 'Sekretaris Desa',
            value: statistics?.sekretaris_desa ?? '-',
            icon: Briefcase,
            color: 'bg-blue-50 text-blue-600',
            iconBg: 'bg-blue-100'
        },
        {
            label: 'Pegawai Desa',
            value: statistics?.pegawai_desa ?? '-',
            icon: Briefcase,
            color: 'bg-yellow-50 text-yellow-600',
            iconBg: 'bg-yellow-100'
        }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Manajemen Akun" />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <Topbar pageTitle="Manajemen Akun" />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Manajemen Akun</h1>
                            <p className="text-sm text-gray-600">Kelola akun pengguna sistem arsip digital</p>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="flex items-center gap-4 mb-6">
                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Cari pengguna..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Role Filter Dropdown */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Semua Role</option>
                                <option value="kepala">Kepala Desa</option>
                                <option value="sekretaris">Sekretaris Desa</option>
                                <option value="pegawai">Pegawai Desa</option>
                            </select>

                            {/* Add User Button */}
                            <Link href={route('users.create')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                <Plus size={20} />
                                Tambah Akun
                            </Link>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Daftar Pengguna</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                                                Pengguna
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                                                Role
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                                                Status
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                                                Terakhir Login
                                            </th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">
                                                            {user.last_login === 'Online' ? (
                                                                <span className="flex items-center gap-2">
                                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                                    Online
                                                                </span>
                                                            ) : (
                                                                user.last_login
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/manajemen-akun/${user.id}/edit`}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={18} />
                                                            </Link>
                                                            <button
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    Tidak ada data pengguna
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className={`${stat.color} rounded-lg p-6 border border-gray-200`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                                                <Icon size={24} className={stat.color.split(' ')[1]} />
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                                        <div className="text-3xl font-bold">{stat.value}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
