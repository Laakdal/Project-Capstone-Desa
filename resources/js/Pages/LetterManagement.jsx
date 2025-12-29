import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import {
    FolderOpen, Eye, Download, Search, Calendar, User as UserIcon,
    Plus, Edit2, Trash2, FolderPlus, X, Filter, FolderMinus
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function LetterManagement({
    auth,
    letters,
    folders = [],
    templateTypes = [],
    totalArchiveCount = 0,
    filters = {},
    userRole,
    flash
}) {
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [showMoveToFolderModal, setShowMoveToFolderModal] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(filters.folder_id || 'all');
    const [showFilters, setShowFilters] = useState(false);

    const isSekdes = userRole === 'Sekretaris Desa';
    const isKades = userRole === 'Kepala Desa';
    const isArsip = isSekdes || isKades;
    const pageTitle = isArsip ? 'Arsip' : 'Pengelolaan Surat';

    // Get correct route based on role
    const getIndexRoute = () => {
        return isArsip ? '/arsip' : '/pengelolaan-surat';
    };

    // Folder form
    const folderForm = useForm({
        name: '',
        description: '',
    });

    // Move to folder form
    const moveForm = useForm({
        letter_id: null,
        folder_id: null,
    });

    // Filter form
    const [localFilters, setLocalFilters] = useState({
        template_type: filters.template_type || 'all',
        status: filters.status || 'all',
        search: filters.search || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        year: filters.year || '',
        month: filters.month || '',
    });

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Handle filter change
    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    // Apply filters
    const applyFilters = () => {
        const params = { ...localFilters };
        if (selectedFolder !== 'all') {
            params.folder_id = selectedFolder;
        }
        router.get(getIndexRoute(), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Reset filters
    const resetFilters = () => {
        setLocalFilters({
            template_type: 'all',
            status: 'all',
            search: '',
            date_from: '',
            date_to: '',
            year: '',
            month: '',
        });
        setSelectedFolder('all');
        router.get(getIndexRoute());
    };

    // Create folder
    const handleCreateFolder = (e) => {
        e.preventDefault();
        folderForm.post(route('folders.store'), {
            onSuccess: () => {
                setShowCreateFolderModal(false);
                folderForm.reset();
            },
        });
    };

    // Move letter to folder
    const handleMoveToFolder = (e) => {
        e.preventDefault();
        if (!moveForm.data.folder_id) {
            toast.error('Pilih folder tujuan');
            return;
        }

        moveForm.post(route('folders.add-letter', moveForm.data.folder_id), {
            data: { letter_id: moveForm.data.letter_id },
            onSuccess: () => {
                setShowMoveToFolderModal(false);
                moveForm.reset();
                setSelectedLetter(null);
            },
        });
    };

    // Delete folder
    const handleDeleteFolder = (folderId) => {
        if (confirm('Yakin ingin menghapus folder ini?')) {
            router.delete(route('folders.destroy', folderId));
        }
    };

    // Remove letter from folder
    const handleRemoveFromFolder = (letterId) => {
        if (selectedFolder === 'all') {
            toast.error('Pilih folder terlebih dahulu');
            return;
        }

        if (confirm('Keluarkan surat dari folder ini?\n\nSurat tidak akan dihapus, hanya dikeluarkan dari folder.')) {
            router.post(route('folders.remove-letter', selectedFolder), {
                letter_id: letterId
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Surat berhasil dikeluarkan dari folder');
                },
            });
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
            'sent': { label: 'Terkirim', color: 'bg-blue-100 text-blue-800' },
            'revoked': { label: 'Dikembalikan', color: 'bg-yellow-100 text-yellow-800' },
            'continued': { label: 'Diteruskan', color: 'bg-orange-100 text-orange-800' },
            'approved': { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
            'rejected': { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title={pageTitle} />

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <FolderOpen className="w-8 h-8 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                            </div>
                            <p className="text-gray-600">
                                {isSekdes
                                    ? 'Arsip surat yang telah disetujui atau ditolak'
                                    : 'Kelola semua surat Anda'}
                            </p>
                        </div>

                        {isArsip && (
                            <button
                                onClick={() => setShowCreateFolderModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="w-5 h-5" />
                                Buat Folder Baru
                            </button>
                        )}
                    </div>

                    <div className="flex gap-6">
                        {/* Folder Sidebar (Sekdes & Kades) */}
                        {isArsip && (
                            <div className="w-64 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">Folder</h3>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setSelectedFolder('all');
                                                router.get(getIndexRoute(), { ...localFilters, folder_id: 'all' });
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${selectedFolder === 'all'
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <FolderOpen className="w-4 h-4" />
                                            <span className="flex-1">Semua Arsip</span>
                                            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                                {totalArchiveCount}
                                            </span>
                                        </button>

                                        {folders.map(folder => (
                                            <div key={folder.id} className="group">
                                                <button
                                                    onClick={() => {
                                                        setSelectedFolder(folder.id);
                                                        router.get(getIndexRoute(), { ...localFilters, folder_id: folder.id });
                                                    }}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${selectedFolder == folder.id
                                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                                        : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <FolderOpen className="w-4 h-4" />
                                                    <span className="flex-1 truncate">{folder.name}</span>
                                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                                        {folder.letters_count || 0}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFolder(folder.id)}
                                                    className="ml-8 text-xs text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Filters */}
                            <div className="bg-white rounded-lg shadow p-4 mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                                    >
                                        <Filter className="w-5 h-5" />
                                        Filter
                                    </button>

                                    <div className="flex-1 relative">
                                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari nomor surat, perihal, atau nama pembuat..."
                                            value={localFilters.search}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <button
                                        onClick={applyFilters}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Terapkan
                                    </button>

                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Reset
                                    </button>
                                </div>

                                {showFilters && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Jenis Surat
                                            </label>
                                            <select
                                                value={localFilters.template_type}
                                                onChange={(e) => handleFilterChange('template_type', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            >
                                                {templateTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {!isSekdes && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Status
                                                </label>
                                                <select
                                                    value={localFilters.status}
                                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                >
                                                    <option value="all">Semua Status</option>
                                                    <option value="draft">Draft</option>
                                                    <option value="sent">Terkirim</option>
                                                    <option value="revoked">Dikembalikan</option>
                                                    <option value="continued">Diteruskan</option>
                                                    <option value="approved">Disetujui</option>
                                                    <option value="rejected">Ditolak</option>
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Dari Tanggal
                                            </label>
                                            <input
                                                type="date"
                                                value={localFilters.date_from}
                                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sampai Tanggal
                                            </label>
                                            <input
                                                type="date"
                                                value={localFilters.date_to}
                                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Letters Table */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    No. Surat
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Jenis
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Perihal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Pembuat
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {letters.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <FolderOpen className="w-16 h-16 text-gray-300 mb-4" />
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                {isSekdes ? 'Arsip Kosong' : 'Belum Ada Surat'}
                                                            </h3>
                                                            <p className="text-gray-600">
                                                                {isSekdes
                                                                    ? 'Belum ada surat yang diarsipkan'
                                                                    : 'Anda belum membuat surat'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                letters.data.map((letter) => {
                                                    const statusBadge = getStatusBadge(letter.status);
                                                    return (
                                                        <tr key={letter.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {letter.letter_number || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {letter.template_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {letter.subject || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                <div className="flex items-center gap-2">
                                                                    <UserIcon className="w-4 h-4" />
                                                                    {letter.user?.name || '-'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {new Date(letter.created_at).toLocaleDateString('id-ID')}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                                                                    {statusBadge.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    {letter.pdf_path && (
                                                                        <>
                                                                            <a
                                                                                href={route('letter-management.show-pdf', letter.id)}
                                                                                target="_blank"
                                                                                className="text-blue-600 hover:text-blue-900"
                                                                                title="Lihat PDF"
                                                                            >
                                                                                <Eye className="w-4 h-4" />
                                                                            </a>
                                                                            <a
                                                                                href={route('letter-management.download-pdf', letter.id)}
                                                                                className="text-green-600 hover:text-green-900"
                                                                                title="Download PDF"
                                                                            >
                                                                                <Download className="w-4 h-4" />
                                                                            </a>
                                                                        </>
                                                                    )}
                                                                    {isArsip && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedLetter(letter);
                                                                                    moveForm.setData({ letter_id: letter.id, folder_id: null });
                                                                                    setShowMoveToFolderModal(true);
                                                                                }}
                                                                                className="text-purple-600 hover:text-purple-900"
                                                                                title="Pindah ke Folder"
                                                                            >
                                                                                <FolderPlus className="w-4 h-4" />
                                                                            </button>
                                                                            {filters.folder_id && filters.folder_id !== 'all' && (
                                                                                <button
                                                                                    onClick={() => handleRemoveFromFolder(letter.id)}
                                                                                    className="text-red-600 hover:text-red-900"
                                                                                    title="Keluarkan dari Folder"
                                                                                >
                                                                                    <FolderMinus className="w-4 h-4" />
                                                                                </button>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {letters.links && letters.links.length > 3 && (
                                    <div className="p-6 border-t border-gray-200">
                                        <nav className="flex justify-center">
                                            <div className="inline-flex rounded-md shadow-sm -space-x-px">
                                                {letters.links.map((link, index) => (
                                                    <a
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Create Folder Modal */}
            {showCreateFolderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Buat Folder Baru</h3>
                            <button onClick={() => setShowCreateFolderModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateFolder}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Folder
                                </label>
                                <input
                                    type="text"
                                    value={folderForm.data.name}
                                    onChange={(e) => folderForm.setData('name', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Contoh: Surat Meeting Januari"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    value={folderForm.data.description}
                                    onChange={(e) => folderForm.setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Deskripsi folder..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateFolderModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={folderForm.processing}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {folderForm.processing ? 'Menyimpan...' : 'Buat Folder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Move to Folder Modal */}
            {showMoveToFolderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Pindah ke Folder</h3>
                            <button onClick={() => setShowMoveToFolderModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Pilih folder untuk surat: <strong>{selectedLetter?.letter_number}</strong>
                        </p>

                        <form onSubmit={handleMoveToFolder}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Folder Tujuan
                                </label>
                                <select
                                    value={moveForm.data.folder_id || ''}
                                    onChange={(e) => moveForm.setData('folder_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="">Pilih Folder</option>
                                    {folders.map(folder => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMoveToFolderModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={moveForm.processing}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {moveForm.processing ? 'Memindahkan...' : 'Pindahkan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
