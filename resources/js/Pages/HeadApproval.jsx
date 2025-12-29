import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { CheckCircle, XCircle, Eye, Calendar, User as UserIcon, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

export default function HeadApproval({ auth, letters, flash }) {
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        action: '',
        notes: '',
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

    const handleApproval = (letter, approvalAction) => {
        setSelectedLetter(letter);
        setAction(approvalAction);
        setData('action', approvalAction);
        setShowModal(true);
    };

    const submitApproval = (e) => {
        e.preventDefault();
        post(route('head.approval', selectedLetter.id), {
            onSuccess: () => {
                setShowModal(false);
                reset();
                setSelectedLetter(null);
            },
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'continued': { label: 'Menunggu Approval', color: 'bg-orange-100 text-orange-800' },
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Approval Surat" />

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Approval Surat</h1>
                        </div>
                        <p className="text-gray-600">
                            Surat yang menunggu approval dari Kepala Desa
                        </p>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow">
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
                                            Pengirim
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
                                    {letters.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <CheckCircle className="w-16 h-16 mb-4 text-gray-300" />
                                                    <p className="text-lg font-medium">Tidak Ada Surat Pending</p>
                                                    <p className="text-sm">Semua surat sudah ditinjau</p>
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
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div>
                                                            {letter.subject || '-'}
                                                            {letter.secretary_notes && (
                                                                <div className="mt-1 flex items-start gap-1 text-xs text-gray-500">
                                                                    <MessageSquare className="w-3 h-3 mt-0.5" />
                                                                    <span className="italic">{letter.secretary_notes}</span>
                                                                </div>
                                                            )}
                                                        </div>
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
                                                                <a
                                                                    href={route('letter-management.show-pdf', letter.id)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="Lihat PDF"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => handleApproval(letter, 'reject')}
                                                                className="text-red-600 hover:text-red-900 flex items-center gap-1 px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                                                                title="Tolak"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                <span className="text-xs">Tolak</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleApproval(letter, 'approve')}
                                                                className="text-green-600 hover:text-green-900 flex items-center gap-1 px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                                                                title="Setujui"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                <span className="text-xs">Setujui</span>
                                                            </button>
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
                            <div className="px-6 py-4 border-t border-gray-200">
                                <nav className="flex justify-center">
                                    <div className="inline-flex rounded-md shadow-sm -space-x-px">
                                        {letters.links.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''} ${index === 0 ? 'rounded-l-md' : ''
                                                    } ${index === letters.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Approval Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {action === 'reject' ? 'Tolak Surat' : 'Setujui Surat'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {action === 'reject'
                                ? 'Surat akan ditolak dan diarsipkan.'
                                : 'Surat akan disetujui dan diarsipkan.'}
                        </p>

                        <form onSubmit={submitApproval}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tambahkan catatan untuk surat ini..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        reset();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`flex-1 px-4 py-2 rounded-lg text-white ${action === 'reject'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                        } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? 'Memproses...' : action === 'reject' ? 'Tolak' : 'Setujui'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
