import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { FileText, Eye, Download, Filter, Search, Calendar, User as UserIcon, AlertCircle } from 'lucide-react';

export default function LetterManagement({ auth, letters }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Get status badge color
    const getStatusBadge = (status) => {
        const statusMap = {
            'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: '📝' },
            'sent': { label: 'Menunggu Review Sekdes', color: 'bg-blue-100 text-blue-800', icon: '⏳' },
            'revoked': { label: 'Perlu Revisi', color: 'bg-yellow-100 text-yellow-800', icon: '↩️' },
            'continued': { label: 'Menunggu Approval Kades', color: 'bg-orange-100 text-orange-800', icon: '📤' },
            'approved': { label: 'Disetujui', color: 'bg-emerald-100 text-emerald-800', icon: '✅' },
            'rejected': { label: 'Ditolak', color: 'bg-red-100 text-red-800', icon: '❌' },
        };

        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: '📄' };
    };

    // Filter letters
    const filteredLetters = letters.data.filter(letter => {
        const matchesSearch = letter.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            letter.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            letter.letter_number?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || letter.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Get status counts
    const statusCounts = {
        all: letters.data.length,
        sent: letters.data.filter(l => l.status === 'sent').length,
        revoked: letters.data.filter(l => l.status === 'revoked').length,
        continued: letters.data.filter(l => l.status === 'continued').length,
        approved: letters.data.filter(l => l.status === 'approved').length,
        rejected: letters.data.filter(l => l.status === 'rejected').length,
    };

    return (
        <>
            <Head title="Pengelolaan Surat" />

            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {/* Topbar */}
                    <Topbar pageTitle="Pengelolaan Surat" />

                    {/* Content */}
                    <div className="p-6">
                        {/* Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Total Surat</p>
                                        <p className="text-2xl font-bold text-gray-800">{statusCounts.all}</p>
                                    </div>
                                    <div className="text-3xl">📋</div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-blue-200 hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-blue-600 uppercase">Review Sekdes</p>
                                        <p className="text-2xl font-bold text-blue-700">{statusCounts.sent}</p>
                                    </div>
                                    <div className="text-3xl">⏳</div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-yellow-200 hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-yellow-600 uppercase">Perlu Revisi</p>
                                        <p className="text-2xl font-bold text-yellow-700">{statusCounts.revoked}</p>
                                    </div>
                                    <div className="text-3xl">↩️</div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-orange-200 hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-orange-600 uppercase">Review Kades</p>
                                        <p className="text-2xl font-bold text-orange-700">{statusCounts.continued}</p>
                                    </div>
                                    <div className="text-3xl">📤</div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-green-200 hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-green-600 uppercase">Disetujui</p>
                                        <p className="text-2xl font-bold text-green-700">{statusCounts.approved}</p>
                                    </div>
                                    <div className="text-3xl">✅</div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan nomor surat, perihal, atau penerima..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">Semua Status ({statusCounts.all})</option>
                                        <option value="sent">Menunggu Review Sekdes ({statusCounts.sent})</option>
                                        <option value="revoked">Perlu Revisi ({statusCounts.revoked})</option>
                                        <option value="continued">Menunggu Approval Kades ({statusCounts.continued})</option>
                                        <option value="approved">Disetujui ({statusCounts.approved})</option>
                                        <option value="rejected">Ditolak ({statusCounts.rejected})</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Letters Table */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
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
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredLetters.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <FileText className="w-12 h-12 mb-3 text-gray-300" />
                                                        <p className="text-sm font-medium">Tidak ada surat yang ditemukan</p>
                                                        <p className="text-xs mt-1">Coba ubah filter atau kata kunci pencarian</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLetters.map((letter) => {
                                                const statusBadge = getStatusBadge(letter.status);
                                                return (
                                                    <tr key={letter.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-2xl">📄</span>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {letter.letter_number || '-'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900 font-medium">
                                                                {letter.subject || <span className="text-gray-400 italic">Tidak ada perihal</span>}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {letter.template_type ? letter.template_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Surat Umum'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {letter.recipient || <span className="text-gray-400 italic">Tidak ada penerima</span>}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(letter.created_at).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-2">
                                                                <span className={`px-3 py-1.5 inline-flex items-center gap-2 text-xs font-semibold rounded-lg w-fit ${statusBadge.color}`}>
                                                                    <span>{statusBadge.icon}</span>
                                                                    {statusBadge.label}
                                                                </span>
                                                                {letter.status === 'revoked' && letter.secretary_notes && (
                                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-xs">
                                                                        <div className="flex items-start gap-2">
                                                                            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                                            <div>
                                                                                <p className="text-xs font-semibold text-yellow-800 mb-1">Catatan Sekdes:</p>
                                                                                <p className="text-xs text-yellow-700">{letter.secretary_notes}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {letter.status === 'rejected' && letter.head_notes && (
                                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-xs">
                                                                        <div className="flex items-start gap-2">
                                                                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                                            <div>
                                                                                <p className="text-xs font-semibold text-red-800 mb-1">Alasan Ditolak:</p>
                                                                                <p className="text-xs text-red-700">{letter.head_notes}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                {/* Revisi Button for revoked letters */}
                                                                {letter.status === 'revoked' && (
                                                                    <a
                                                                        href={route('letters.edit', letter.id)}
                                                                        className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5"
                                                                        title="Revisi Surat"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                        Revisi
                                                                    </a>
                                                                )}

                                                                {/* PDF Actions */}
                                                                {letter.pdf_path ? (
                                                                    <>
                                                                        <a
                                                                            href={route('letter-management.show-pdf', letter.id)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1"
                                                                            title="Lihat PDF"
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                        </a>
                                                                        <a
                                                                            href={route('letter-management.download-pdf', letter.id)}
                                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition flex items-center gap-1"
                                                                            title="Download PDF"
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                        </a>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-gray-400 text-xs italic">Tidak ada PDF</span>
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
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Menampilkan <span className="font-medium">{letters.from || 0}</span> sampai <span className="font-medium">{letters.to || 0}</span> dari <span className="font-medium">{letters.total || 0}</span> surat
                                        </div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {letters.links.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                                        ? 'z-10 bg-blue-500 border-blue-500 text-white'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''} ${index === 0 ? 'rounded-l-md' : ''
                                                        } ${index === letters.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
