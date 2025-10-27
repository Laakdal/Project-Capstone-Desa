import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('arsip');
    const [viewMode, setViewMode] = useState('grid');

    const pinnedDocs = [
        {
            id: 1,
            title: 'Surat Keterangan Domisili',
            description: 'Template standar untuk surat keterangan domisili',
            category: 'Surat Keterangan',
            badge: 'Template',
            icon: '📄',
            color: 'blue'
        },
        {
            id: 2,
            title: 'Surat Pengantar SKCK',
            description: 'Template untuk surat pengantar SKCK',
            category: 'Surat Pengantar',
            badge: 'Template',
            icon: '✅',
            color: 'green'
        }
    ];

    const folders = [
        { name: 'Surat Keterangan', count: 12, icon: '📁', color: 'blue' },
        { name: 'Surat Pengantar', count: 8, icon: '📁', color: 'green' },
        { name: 'Surat Permohonan', count: 5, icon: '📁', color: 'purple' },
        { name: 'Surat Undangan', count: 2, icon: '📁', color: 'orange' },
        { name: 'Arsip Lama', count: 45, icon: '📁', color: 'red' }
    ];

    const recentDocs = [
        {
            id: 1,
            name: 'Surat Keterangan Usaha - Ahmad Fauzi',
            file: 'SK_001_2024.pdf',
            category: 'Surat Keterangan',
            status: 'Selesai',
            statusColor: 'green',
            date: '15 Jan 2024'
        },
        {
            id: 2,
            name: 'Surat Pengantar Nikah - Siti Aminah',
            file: 'SP_003_2024.pdf',
            category: 'Surat Pengantar',
            status: 'Menunggu TTD',
            statusColor: 'yellow',
            date: '14 Jan 2024'
        },
        {
            id: 3,
            name: 'Surat Permohonan Bantuan - Budi Santoso',
            file: 'SPM_023_2024.pdf',
            category: 'Surat Permohonan',
            status: 'Ditolak',
            statusColor: 'red',
            date: '13 Jan 2024'
        }
    ];

    const menuItems = [
        { icon: '🏠', label: 'Dashboard', count: null, active: true },
        { icon: '📄', label: 'Arsip Dokumen', count: null, active: false },
        { icon: '📨', label: 'Surat Masuk', count: null, active: false },
        { icon: '📤', label: 'Surat Keluar', count: null, active: false },
        { icon: '📋', label: 'Surat Keterangan', count: 12, active: false },
        { icon: '📬', label: 'Surat Pengantar', count: 8, active: false },
        { icon: '📝', label: 'Surat Permohonan', count: 5, active: false },
        { icon: '📮', label: 'Surat Undangan', count: 3, active: false }
    ];

    return (
        <>
            <Head title="SiArsip Desa" />
            
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                                S
                            </div>
                            <span className="font-semibold text-gray-800">SiArsip Desa</span>
                        </div>
                    </div>

                    <div className="p-4">
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <span>+</span>
                            <span>Buat Folder Baru</span>
                        </button>
                    </div>

                    <nav className="px-2">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                                    item.active
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span>{item.icon}</span>
                                <span className="flex-1 text-left text-sm">{item.label}</span>
                                {item.count && (
                                    <span className="text-xs text-gray-500">{item.count}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                        <button className="w-full flex items-center gap-2 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg">
                            <span>⚙️</span>
                            <span className="text-sm">Pengaturan</span>
                        </button>
                        <button className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg mt-1">
                            <span>🚪</span>
                            <span className="text-sm">Keluar</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Admin (Sidoarjo)</span>
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold">SN</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="p-6">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setActiveTab('arsip')}
                                    className={`pb-3 border-b-2 ${
                                        activeTab === 'arsip'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-600'
                                    }`}
                                >
                                    Arsip Dokumen
                                </button>
                                <button
                                    onClick={() => setActiveTab('perlu')}
                                    className={`pb-3 border-b-2 ${
                                        activeTab === 'perlu'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-600'
                                    }`}
                                >
                                    Perlu Persetujuan 🔴
                                </button>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Cari dokumen..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <span className="absolute left-3 top-2.5">🔍</span>
                            </div>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg">
                                <option>Semua Jenis</option>
                            </select>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg">
                                <option>Urutkan: Terbaru</option>
                            </select>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg">
                                ▼ Filter
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 border rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                            >
                                ⊞
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 border rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                            >
                                ☰
                            </button>
                        </div>

                        {/* Pinned Documents */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                ⭐ Dokumen Dipinkan
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {pinnedDocs.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`text-3xl bg-${doc.color}-50 p-3 rounded`}>
                                                {doc.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold text-gray-800">{doc.title}</h3>
                                                    <button className="text-yellow-500">⭐</button>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">{doc.category}</span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                                        {doc.badge}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Folder Dokumen */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Folder Dokumen</h2>
                            <div className="grid grid-cols-6 gap-4">
                                {folders.map((folder, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition cursor-pointer text-center"
                                    >
                                        <div className={`text-4xl mb-2 text-${folder.color}-500`}>
                                            {folder.icon}
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-800 mb-1">
                                            {folder.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">{folder.count} dokumen</p>
                                    </div>
                                ))}
                                <div className="bg-white p-4 rounded-lg border border-dashed border-gray-300 hover:bg-gray-50 transition cursor-pointer text-center flex flex-col items-center justify-center">
                                    <div className="text-4xl mb-2 text-gray-400">+</div>
                                    <p className="text-xs text-gray-500">Buat Folder</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Documents */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Dokumen Terbaru</h2>
                            <div className="bg-white rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Nama Dokumen
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Jenis
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Dibuat
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {recentDocs.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">📄</span>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{doc.name}</p>
                                                            <p className="text-xs text-gray-500">{doc.file}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                        {doc.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 text-xs rounded-full ${
                                                            doc.statusColor === 'green'
                                                                ? 'bg-green-100 text-green-700'
                                                                : doc.statusColor === 'yellow'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        ● {doc.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{doc.date}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="text-blue-600 hover:text-blue-800">👁️</button>
                                                        <button className="text-gray-600 hover:text-gray-800">⋯</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
