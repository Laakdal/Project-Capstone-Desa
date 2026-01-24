import { Head, useForm, usePage } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';
import Sidebar, { Topbar } from '@/Components/Sidebar';
import { generateLetterTemplate } from '@/utils/letterTemplates';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function Create() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showPreview, setShowPreview] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        template_type: '',
        letter_number: '',
        subject: '', // Perihal
        recipient: '', // Penerima
        status: 'draft',
        content: '',
        meta_data: {
            perihal: '',
            tujuan: '',
            lampiran: '',
            nama_lengkap: '',
            nik: '',
            tempat_lahir: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            agama: '',
            pekerjaan: '',
            alamat_lengkap: '',
            jabatan: '',
        },
    });

    // Define all templates with role restrictions
    const allTemplates = [
        { id: 'surat_pengunduran_diri', name: 'Surat Pengunduran Diri', roles: ['Pegawai Desa'] },
        { id: 'surat_cuti', name: 'Surat Cuti', roles: ['Pegawai Desa'] },
        { id: 'memo', name: 'Memo', roles: ['Pegawai Desa'] },
        { id: 'surat_keputusan', name: 'Surat Keputusan (SK)', roles: ['Sekretaris Desa'] },
        { id: 'surat_perintah_perjalanan_dinas', name: 'Surat Perintah Perjalanan Dinas (SPPD)', roles: ['Sekretaris Desa'] },
        { id: 'surat_tugas', name: 'Surat Tugas (ST)', roles: ['Sekretaris Desa'] },
    ];

    // Filter templates based on user role
    const templates = allTemplates.filter(template =>
        template.roles.includes(user.role)
    );

    // Redirect Kepala Desa if they try to access this page
    useEffect(() => {
        if (user.role === 'Kepala Desa') {
            window.location.href = '/dashboard';
        }
    }, [user.role]);


    const generateTemplateContent = (type) => {
        // Get current user data from Inertia page props
        const user = usePage().props.auth.user;

        // Use the helper function from letterTemplates.js
        return generateLetterTemplate(type, user);
    };
    const handleTemplateChange = (e) => {
        const type = e.target.value;
        setData(prev => ({
            ...prev,
            template_type: type,
            content: generateTemplateContent(type)
        }));
    };

    const handleMetaChange = (field, value) => {
        setData('meta_data', { ...data.meta_data, [field]: value });
    };

    // Simple preview - just show modal with content
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
        post(route('letters.store'));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Pembuatan Surat" />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Topbar />
                <div className="py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-semibold mb-6">Pembuatan Surat</h2>

                        <div className="flex gap-6">
                            {/* Left Panel - Form */}
                            <div className="w-1/3">
                                <div className="bg-white p-6 shadow sm:rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold mb-4">Detail Surat</h3>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Template Surat
                                        </label>
                                        <select
                                            value={data.template_type}
                                            onChange={handleTemplateChange}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Pilih Template</option>
                                            {templates.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                        {errors.template_type && (
                                            <p className="text-red-500 text-sm mt-1">{errors.template_type}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Perihal
                                        </label>
                                        <input
                                            type="text"
                                            value={data.subject}
                                            onChange={e => setData('subject', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                            placeholder="Perihal surat"
                                        />
                                    </div>

                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={handlePreview}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => submit('draft')}
                                            disabled={processing}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
                                        >
                                            Simpan Draft
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => submit('sent')}
                                            disabled={processing}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Kirim Surat
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
