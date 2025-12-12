import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Home, FolderOpen, Users, FileText, Settings } from 'lucide-react';

// Layout component that includes both Sidebar and Topbar
export default function Sidebar({ children }) {
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard', href: '/dashboard' },
        { id: 'dokumen', icon: FolderOpen, label: 'Dokumen', href: '/dokumen' },
        { id: 'manajemen-akun', icon: Users, label: 'Manajemen Akun', href: '/manajemen-akun' },
        { id: 'laporan', icon: FileText, label: 'Laporan', href: '/laporan' },
        { id: 'pengaturan', icon: Settings, label: 'Pengaturan', href: '/pengaturan' }
    ];

    return (
        <>
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
                {/* Logo Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                            S
                        </div>
                        <span className="font-semibold text-gray-800">SiArsip Desa</span>
                    </div>
                </div>

                {/* Create Folder Button */}
                <div className="p-4">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <span>+</span>
                        <span>Buat Folder Baru</span>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="px-3 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                                    activeMenu === item.id
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => setActiveMenu(item.id)}
                            >
                                <Icon size={20} className={activeMenu === item.id ? 'text-white' : 'text-gray-600'} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}


// Topbar component for use with Sidebar
export function Topbar({ userName = 'Admin', userLocation = 'Sidoarjo', pageTitle = 'Dashboard' }) {
    // Get user initials
    const userInitials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-600">{userLocation}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">{userInitials}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
