import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Home, FolderOpen, Users, FileText, Settings, PenLine, CheckCircle } from 'lucide-react';

// Layout component that includes both Sidebar and Topbar
// Layout component that includes both Sidebar and Topbar
export default function Sidebar({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    const allMenuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard', href: '/dashboard', roles: ['Pegawai Desa', 'Sekretaris Desa', 'Kepala Desa'] },
        { id: 'pembuatan-surat', icon: PenLine, label: 'Pembuatan Surat', href: '/surat/create', roles: ['Pegawai Desa'] },
        { id: 'review-surat', icon: CheckCircle, label: 'Review Surat', href: '/review-surat', roles: ['Sekretaris Desa'] },
        { id: 'approval-surat', icon: CheckCircle, label: 'Approval Surat', href: '/approval-surat', roles: ['Kepala Desa'] },
        { id: 'pengelolaan-surat', icon: FolderOpen, label: 'Pengelolaan Surat', href: '/pengelolaan-surat', roles: ['Pegawai Desa', 'Sekretaris Desa', 'Kepala Desa'] },
        { id: 'manajemen-akun', icon: Users, label: 'Manajemen Akun', href: '/manajemen-akun', roles: ['Sekretaris Desa', 'Kepala Desa'] },
        { id: 'laporan', icon: FileText, label: 'Laporan', href: '/laporan', roles: ['Sekretaris Desa', 'Kepala Desa'] },
        { id: 'pengaturan', icon: Settings, label: 'Pengaturan', href: '/pengaturan', roles: ['Pegawai Desa', 'Sekretaris Desa', 'Kepala Desa'] }
    ];

    // Filter menu items based on user role
    const menuItems = allMenuItems.filter(item => {
        if (!user) return false;
        // Use role column directly from users table
        const userRole = user.role || '';
        return item.roles.includes(userRole);
    });

    // Helper to check if item is active
    const isActive = (href) => {
        if (href === '/dashboard') {
            return url === '/dashboard';
        }
        return url.startsWith(href);
    };

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
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${active
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} className={active ? 'text-white' : 'text-gray-600'} />
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
// Topbar component for use with Sidebar
export function Topbar({ pageTitle = 'Dashboard' }) {
    const { props } = usePage();
    const { user } = props.auth;
    const [showDropdown, setShowDropdown] = useState(false);

    // Fallback if user is not loaded
    const userName = user?.name || 'Guest';
    const userRole = user?.role || 'Pegawai Desa';
    const userEmail = user?.email || '';

    // Get user initials
    const userInitials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
                </div>
                <div className="flex items-center gap-3 relative">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-600">{userRole}</p>
                    </div>

                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 focus:outline-none"
                    >
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                            <span className="text-sm font-semibold">{userInitials}</span>
                        </div>
                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowDropdown(false)}
                            ></div>
                            <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                </div>
                                <div className="py-1">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <Users size={16} />
                                        Profil Saya
                                    </Link>
                                    <Link
                                        href={'/pengaturan'}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <Settings size={16} />
                                        Pengaturan
                                    </Link>
                                </div>
                                <div className="border-t border-gray-100 py-1">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Keluar
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
