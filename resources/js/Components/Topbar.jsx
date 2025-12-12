import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

export default function Topbar({ pageTitle = 'Dashboard' }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Get authenticated user from Inertia shared data
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'User';
    const userRole = auth?.user?.role || 'Staff';

    // Get user initials
    const userInitials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
                </div>
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                    >
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">{userName}</p>
                            <p className="text-xs text-gray-500">{userRole}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">{userInitials}</span>
                        </div>
                        <ChevronDown 
                            size={16} 
                            className={`text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                            {/* User Info Section */}
                            <div className="px-4 py-3 border-b border-gray-200">
                                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500">{auth?.user?.email || ''}</p>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <User size={18} className="text-gray-500" />
                                    <span>Profil Saya</span>
                                </Link>

                                <Link
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <Settings size={18} className="text-gray-500" />
                                    <span>Pengaturan</span>
                                </Link>
                            </div>

                            {/* Logout Section */}
                            <div className="border-t border-gray-200 py-1">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <LogOut size={18} />
                                    <span>Keluar</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
