import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Eye, Download, Filter, Search, Calendar, User as UserIcon } from 'lucide-react';

export default function LetterManagement({ auth, letters }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Get status badge color
    const getStatusBadge = (status) => {
        const statusMap = {
            'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
            'sent': { label: 'Terkirim', color: 'bg-blue-100 text-blue-800' },
            'pending_verification': { label: 'Menunggu Verifikasi', color: 'bg-yellow-100 text-yellow-800' },
            'verified': { label: 'Terverifikasi', color: 'bg-green-100 text-green-800' },
            'pending_approval': { label: 'Menunggu Persetujuan', color: 'bg-orange-100 text-orange-800' },
            'approved': { label: 'Disetujui', color: 'bg-emerald-100 text-emerald-800' },
            'rejected': { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
        };

        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    // Filter letters
    const filteredLetters = letters.data.filter(letter => {
        const matchesSearch = letter.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            letter.recipient?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || letter.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Pengelolaan Surat
                    </h2>
                </div>
            }
        >
            <Head title="Pengelolaan Surat" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan perihal atau penerima..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="draft">Draft</option>
                                        <option value="sent">Terkirim</option>
                                        <option value="pending_verification">Menunggu Verifikasi</option>
                                        <option value="verified">Terverifikasi</option>
                                        <option value="pending_approval">Menunggu Persetujuan</option>
                                        <option value="approved">Disetujui</option>
                                        <option value="rejected">Ditolak</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Letters Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No. Surat
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Perihal
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Penerima
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pembuat
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredLetters.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada surat yang ditemukan
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLetters.map((letter) => {
                                                const statusBadge = getStatusBadge(letter.status);
                                                return (
                                                    <tr key={letter.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {letter.letter_number || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {letter.subject || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {letter.recipient || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center gap-2">
                                                                <UserIcon className="w-4 h-4" />
                                                                {letter.user?.name || 'Unknown'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(letter.created_at).toLocaleDateString('id-ID')}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                                                                {statusBadge.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center gap-2">
                                                                {letter.pdf_path && (
                                                                    <>
                                                                        <a
                                                                            href={route('letter-management.show-pdf', letter.id)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                                            title="Lihat PDF"
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                        </a>
                                                                        <a
                                                                            href={route('letter-management.download-pdf', letter.id)}
                                                                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                                                                            title="Download PDF"
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                        </a>
                                                                    </>
                                                                )}
                                                                {!letter.pdf_path && (
                                                                    <span className="text-gray-400 text-xs">No PDF</span>
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
                                <div className="mt-6 flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {letters.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
