import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { CheckCircle, XCircle, Eye, Calendar, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SecretaryReview({ auth, letters, flash }) {
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

    const handleReview = (letter, reviewAction) => {
        setSelectedLetter(letter);
        setAction(reviewAction);
        setData('action', reviewAction);
        setShowModal(true);
    };

    const submitReview = (e) => {
        e.preventDefault();
        post(route('secretary.review', selectedLetter.id), {
            onSuccess: () => {
                setShowModal(false);
                reset();
                setSelectedLetter(null);
            },
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'sent': { label: 'Menunggu Review', color: 'bg-yellow-100 text-yellow-800' },
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Review Surat" />

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Review Surat</h1>
                        </div>
                        <p className="text-gray-600">
                            Surat yang menunggu review dari Sekretaris Desa
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Menunggu Review</p>
                                    <p className="text-3xl font-bold text-yellow-600 mb-2">{letters.total || 0}</p>
                                    <p className="text-xs text-gray-500">Surat perlu diverifikasi</p>
                                </div>
                                <div className="text-4xl">📋</div>
                            </div>
                        </div>

                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Diteruskan</p>
                                    <p className="text-3xl font-bold text-green-600 mb-2">0</p>
                                    <p className="text-xs text-gray-500">Surat yang disetujui</p>
                                </div>
                                <div className="text-4xl">✅</div>
                            </div>
                        </div>

                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Dikembalikan</p>
                                    <p className="text-3xl font-bold text-red-600 mb-2">0</p>
                                    <p className="text-xs text-gray-500">Surat perlu revisi</p>
                                </div>
                                <div className="text-4xl">↩️</div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Daftar Surat Menunggu Review</h2>
                        </div>

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
                                    {letters.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="text-6xl mb-4">📭</div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Surat</h3>
                                                    <p className="text-gray-600">Tidak ada surat yang menunggu review saat ini</p>
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
                                                                <a
                                                                    href={route('letter-management.show-pdf', letter.id)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1 px-2 py-1 border border-blue-300 rounded hover:bg-blue-50"
                                                                    title="Lihat PDF"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    <span className="text-xs">Lihat</span>
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => handleReview(letter, 'revoke')}
                                                                className="text-red-600 hover:text-red-900 flex items-center gap-1 px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                                                                title="Kembalikan"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                <span className="text-xs">Kembalikan</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReview(letter, 'continue')}
                                                                className="text-green-600 hover:text-green-900 flex items-center gap-1 px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                                                                title="Teruskan"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                <span className="text-xs">Teruskan</span>
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
                </main>
            </div>

            {/* Review Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">
                            {action === 'revoke' ? 'Kembalikan Surat' : 'Teruskan Surat'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {action === 'revoke'
                                ? 'Surat akan dikembalikan ke Pegawai untuk revisi.'
                                : 'Surat akan diteruskan ke Kepala Desa untuk approval.'}
                        </p>

                        <form onSubmit={submitReview}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catatan {action === 'revoke' ? '(Wajib)' : '(Opsional)'}
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={action === 'revoke' ? 'Jelaskan alasan pengembalian...' : 'Tambahkan catatan untuk surat ini...'}
                                    required={action === 'revoke'}
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
                                    className={`flex-1 px-4 py-2 rounded-lg text-white ${action === 'revoke'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                        } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? 'Memproses...' : action === 'revoke' ? 'Kembalikan' : 'Teruskan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
