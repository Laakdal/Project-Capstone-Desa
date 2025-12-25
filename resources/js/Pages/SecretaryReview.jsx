import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, XCircle, Eye, Calendar, User as UserIcon, FileText } from 'lucide-react';
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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Review Surat
                    </h2>
                </div>
            }
        >
            <Head title="Review Surat" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-gray-600">
                                    Surat yang menunggu review dari Sekretaris Desa
                                </p>
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
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada surat yang menunggu review
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
                                                                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                                        title="Lihat PDF"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </a>
                                                                )}
                                                                <button
                                                                    onClick={() => handleReview(letter, 'revoke')}
                                                                    className="text-red-600 hover:text-red-900 flex items-center gap-1 px-2 py-1 border border-red-300 rounded"
                                                                    title="Kembalikan"
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                    <span className="text-xs">Kembalikan</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReview(letter, 'continue')}
                                                                    className="text-green-600 hover:text-green-900 flex items-center gap-1 px-2 py-1 border border-green-300 rounded"
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
                                <div className="mt-6 flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
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
        </AuthenticatedLayout>
    );
}
