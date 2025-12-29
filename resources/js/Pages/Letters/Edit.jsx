import { Head, useForm } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';
import Sidebar, { Topbar } from '@/Components/Sidebar';
import { AlertCircle } from 'lucide-react';

export default function Edit({ letter, secretaryNotes }) {
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
        { id: 'surat_keputusan', name: 'Surat Keputusan (SK)' },
        { id: 'surat_perintah_perjalanan_dinas', name: 'Surat Perintah Perjalanan Dinas (SPPD)' },
        { id: 'surat_tugas', name: 'Surat Tugas (ST)' },
        { id: 'memo', name: 'Memo' },
    ];

    const handleMetaChange = (field, value) => {
        setData('meta_data', { ...data.meta_data, [field]: value });
    };

    const handlePreview = () => {
        // Create a temporary form to submit to the preview route in a new tab
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('letters.preview_pdf');
        form.target = '_blank';

        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }

        // Add content
        const contentInput = document.createElement('input');
        contentInput.type = 'hidden';
        contentInput.name = 'content';
        contentInput.value = data.content;
        form.appendChild(contentInput);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
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
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">-- Pilih Template --</option>
                                                {templates.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nomor Surat</label>
                                            <input
                                                type="text"
                                                value={data.letter_number}
                                                onChange={e => setData('letter_number', e.target.value)}
                                                placeholder="Auto Generate / Manual"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Perihal</label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Penerima: Sekretaris Desa (otomatis)</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-2">
                                        <button
                                            onClick={() => submit('draft')}
                                            disabled={processing}
                                            className="w-full bg-gray-200 text-gray-800 rounded py-2 hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            Simpan Draft
                                        </button>
                                        <button
                                            onClick={handlePreview}
                                            type="button"
                                            className="w-full bg-indigo-100 text-indigo-700 rounded py-2 hover:bg-indigo-200"
                                        >
                                            Preview PDF
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
        </div>
    );
}
