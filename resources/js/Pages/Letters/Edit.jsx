import { Head, useForm } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';
import Sidebar, { Topbar } from '@/Components/Sidebar';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ letter, secretaryNotes }) {
    const [showPreview, setShowPreview] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        template_type: letter.template_type || '',
        letter_number: letter.letter_number || '',
        subject: letter.subject || '',
        recipient: letter.recipient || '',
        status: 'draft',
        content: letter.content || '',
        meta_data: letter.meta_data || {},
    });

    const templates = [
        { id: 'surat_pengunduran_diri', name: 'Surat Pengunduran Diri' },
        { id: 'surat_cuti', name: 'Surat Cuti' },
        { id: 'memo', name: 'Memo' },
        { id: 'surat_keputusan', name: 'Surat Keputusan (SK)' },
        { id: 'surat_perintah_perjalanan_dinas', name: 'Surat Perintah Perjalanan Dinas (SPPD)' },
        { id: 'surat_tugas', name: 'Surat Tugas (ST)' },
    ];

    const handleMetaChange = (field, value) => {
        setData('meta_data', { ...data.meta_data, [field]: value });
    };

    // Simple preview - show modal
    const handlePreview = () => {
        if (!data.content) {
            alert('Silakan isi konten surat terlebih dahulu');
            return;
        }
        setShowPreview(true);
    };

    // Print preview content
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview Surat</title>
                <style>
                    @page { size: A4; margin: 2cm; }
                    body { 
                        font-family: 'Times New Roman', serif; 
                        font-size: 12pt;
                        line-height: 1.5;
                        padding: 20px;
                    }
                    .header { 
                        display: flex; 
                        align-items: center; 
                        margin-bottom: 15px;
                    }
                    .header img { height: 90px; }
                    .header-text { 
                        text-align: center; 
                        flex: 1;
                        padding-right: 90px;
                    }
                    .header-text p { margin: 0; line-height: 1.2; }
                    .border-line { 
                        border-bottom: 3px solid #8B4513; 
                        margin: 10px 0 20px 0; 
                    }
                    p {
                        margin-bottom: 1em;
                    }
                    @media print {
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="/logo_desa.png" alt="Logo" />
                    <div class="header-text">
                        <p style="font-size: 14pt; font-weight: bold;">PEMERINTAH KABUPATEN GARUT</p>
                        <p style="font-size: 14pt; font-weight: bold;">KECAMATAN BAYONGBONG</p>
                        <p style="font-size: 18pt; font-weight: 900;">DESA BANJARSARI</p>
                        <p style="font-size: 11pt; font-style: italic; margin-top: 5px;">Alamat : Jln. Ciloa No. 09 Banjarsari Bayongbong Garut - 44162</p>
                    </div>
                </div>
                <div class="border-line"></div>
                ${data.content}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
    };

    const submit = (status) => {
        data.status = status;
        put(route('letters.update', letter.id));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Revisi Surat" />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Topbar pageTitle="Revisi Surat" />

                <div className="p-6">
                    <div className="mx-auto max-w-7xl">
                        {/* Secretary Notes Alert */}
                        {secretaryNotes && (
                            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                                <div className="flex items-start">
                                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-semibold text-yellow-800">
                                            Catatan dari Sekretaris Desa
                                        </h3>
                                        <p className="mt-2 text-sm text-yellow-700">
                                            {secretaryNotes}
                                        </p>
                                        <p className="mt-2 text-xs text-yellow-600 italic">
                                            Silakan perbaiki surat sesuai catatan di atas, lalu kirim ulang.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-6">
                            {/* Form Controls */}
                            <div className="w-1/3 space-y-6">
                                <div className="bg-white p-6 shadow sm:rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">Detail Surat</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Template</label>
                                            <select
                                                value={data.template_type}
                                                onChange={e => setData('template_type', e.target.value)}
                                                disabled
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 text-gray-500 cursor-not-allowed"
                                            >
                                                <option value="">-- Pilih Template --</option>
                                                {templates.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                            <p className="mt-1 text-xs text-gray-500 italic">Template tidak dapat diubah saat edit</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Perihal</label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Perihal surat"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <button
                                            onClick={() => submit('draft')}
                                            disabled={processing}
                                            className="w-full bg-gray-600 text-white rounded py-2 hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            Simpan sebagai Draft
                                        </button>
                                        <button
                                            onClick={handlePreview}
                                            type="button"
                                            className="w-full bg-indigo-100 text-indigo-700 rounded py-2 hover:bg-indigo-200"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => submit('sent')}
                                            disabled={processing}
                                            className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Kirim Ulang Surat
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Editor Area */}
                            <div className="w-2/3">
                                <div className="bg-white p-6 shadow sm:rounded-lg min-h-[800px] flex flex-col">
                                    {/* Visual Header (Not Editable) */}
                                    <div className="mb-4 pointer-events-none select-none" style={{
                                        marginBottom: '15px',
                                        fontFamily: "'Times New Roman', serif",
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <div style={{ width: '15%', textAlign: 'center' }}>
                                                <img src="/logo_desa.png" alt="Logo" style={{ height: '90px', width: 'auto' }} />
                                            </div>
                                            <div style={{ width: '85%', textAlign: 'center', paddingRight: '15%' }}>
                                                <p style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', lineHeight: 1.1 }}>PEMERINTAH KABUPATEN GARUT</p>
                                                <p style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', lineHeight: 1.1 }}>KECAMATAN BAYONGBONG</p>
                                                <p style={{ margin: 0, fontSize: '18pt', fontWeight: '900', lineHeight: 1.1 }}>DESA BANJARSARI</p>
                                                <p style={{ margin: 0, fontSize: '11pt', fontStyle: 'italic', marginTop: '5px' }}>Alamat : Jln. Ciloa No. 09 Banjarsari Bayongbong Garut - 44162</p>
                                            </div>
                                        </div>
                                        <div style={{ borderBottom: '3px solid #8B4513', marginTop: '10px', width: '100%' }}></div>
                                    </div>

                                    <RichTextEditor
                                        content={data.content}
                                        onChange={(html) => setData('content', html)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Preview Modal - PDF Style */}
            {showPreview && (
                <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
                    {/* Modal Header - Dark toolbar */}
                    <div className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
                        <h3 className="text-lg font-medium">Preview Surat</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print / Save PDF
                            </button>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-700 rounded"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* PDF Viewer Area - Dark background with white paper */}
                    <div className="flex-1 overflow-auto p-8 flex justify-center" style={{ backgroundColor: '#525659' }}>
                        {/* A4 Paper */}
                        <div
                            className="bg-white shadow-2xl"
                            style={{
                                width: '210mm',
                                minHeight: '297mm',
                                padding: '20mm 25mm',
                                fontFamily: "'Times New Roman', serif",
                                fontSize: '12pt',
                                lineHeight: 1.5,
                            }}
                        >
                            {/* Letter Header */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ width: '15%', textAlign: 'center' }}>
                                    <img src="/logo_desa.png" alt="Logo" style={{ height: '80px', width: 'auto' }} />
                                </div>
                                <div style={{ width: '85%', textAlign: 'center', paddingRight: '15%' }}>
                                    <p style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', lineHeight: 1.2 }}>PEMERINTAH KABUPATEN GARUT</p>
                                    <p style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', lineHeight: 1.2 }}>KECAMATAN BAYONGBONG</p>
                                    <p style={{ margin: 0, fontSize: '18pt', fontWeight: '900', lineHeight: 1.2 }}>DESA BANJARSARI</p>
                                    <p style={{ margin: 0, fontSize: '10pt', fontStyle: 'italic', marginTop: '5px' }}>Alamat : Jln. Ciloa No. 09 Banjarsari Bayongbong Garut - 44162</p>
                                </div>
                            </div>
                            <div style={{ borderBottom: '3px solid #8B4513', marginBottom: '20px' }}></div>

                            {/* Letter Content - with proper paragraph spacing */}
                            <div
                                dangerouslySetInnerHTML={{ __html: data.content }}
                                className="letter-content-preview"
                            />
                            <style>{`
                                .letter-content-preview p {
                                    margin-bottom: 1em;
                                }
                                .letter-content-preview br {
                                    display: block;
                                    content: "";
                                    margin-top: 0.5em;
                                }
                            `}</style>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
