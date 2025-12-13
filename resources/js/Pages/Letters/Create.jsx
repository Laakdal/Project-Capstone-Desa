import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';
import { useState, useEffect } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        template_type: '',
        letter_number: '',
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
        },
    });

    const templates = [
        { id: 'surat_keterangan_domisili', name: 'Surat Keterangan Domisili' },
        { id: 'surat_pengantar', name: 'Surat Pengantar' },
        { id: 'surat_keterangan_usaha', name: 'Surat Keterangan Usaha' },
    ];

    const generateTemplateContent = (type) => {
        // This acts as a client-side template generator for immediate feedback
        // In a real app, this might come from the server or a more robust template engine
        if (type === 'surat_keterangan_domisili') {
            return `
                <p style="text-align: center"><strong>SURAT KETERANGAN DOMISILI</strong></p>
                <p style="text-align: center">Nomor: [NOMOR_SURAT]</p>
                <br>
                <p>Yang bertanda tangan di bawah ini, Kepala Desa Sukamaju Kecamatan Sukamaju Kabupaten Sukamaju, dengan ini menerangkan bahwa:</p>
                <br>
                <table style="border: none; margin-left: 20px;">
                    <tbody>
                        <tr><td>Nama</td><td>: [NAMA_LENGKAP]</td></tr>
                        <tr><td>NIK</td><td>: [NIK]</td></tr>
                        <tr><td>Tempat/Tgl Lahir</td><td>: [TEMPAT_LAHIR], [TANGGAL_LAHIR]</td></tr>
                        <tr><td>Jenis Kelamin</td><td>: [JENIS_KELAMIN]</td></tr>
                        <tr><td>Agama</td><td>: [AGAMA]</td></tr>
                        <tr><td>Pekerjaan</td><td>: [PEKERJAAN]</td></tr>
                        <tr><td>Alamat</td><td>: [ALAMAT_LENGKAP]</td></tr>
                    </tbody>
                </table>
                <br>
                <p>Adalah benar-benar penduduk Desa Sukamaju yang berdomisili di alamat tersebut di atas.</p>
                <p>Surat keterangan ini dibuat untuk keperluan [KEPERLUAN] dan dapat dipergunakan seperlunya.</p>
                <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
                <br>
                <div style="text-align: right;">
                    <p>Sukamaju, [TANGGAL_SURAT]</p>
                    <p>Kepala Desa Sukamaju</p>
                    <br><br><br>
                    <p><strong>[NAMA_KEPALA_DESA]</strong></p>
                </div>
            `;
        }
        if (type === 'surat_pengantar') {
            return `
                <p style="text-align: center"><strong>SURAT PENGANTAR</strong></p>
                <p style="text-align: center">Nomor: [NOMOR_SURAT]</p>
                <br>
                <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                <br>
                <table style="border: none; margin-left: 20px;">
                    <tbody>
                        <tr><td>Nama</td><td>: [NAMA_LENGKAP]</td></tr>
                        <tr><td>NIK</td><td>: [NIK]</td></tr>
                        <tr><td>Alamat</td><td>: [ALAMAT_LENGKAP]</td></tr>
                    </tbody>
                </table>
                <br>
                <p>Orang tersebut adalah benar warga kami yang bermaksud mengurus [KEPERLUAN].</p>
                <br>
                <div style="text-align: right;">
                    <p>Sukamaju, [TANGGAL_SURAT]</p>
                    <p>Kepala Desa Sukamaju</p>
                </div>
            `;
        }
        return '';
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

    // Auto-update content when meta fields change (simple replace)
    useEffect(() => {
        if (!data.template_type) return;

        // This is a simplified way to keep the preview live-updated without re-rendering everything destructively
        // In a real Tiptap implementation, we might use placeholders or nodes. 
        // For this PBI, we will keep it simple: The user can edit the text manually, 
        // or we give them the template and they fill it.
        // If we hard-replace every time, we lose their custom edits.
        // So, we only set content on template change.

    }, [data.meta_data]);

    const submit = (status) => {
        setData('status', status);
        // We need to pass the status immediately, so we can't rely on state update for this sync call
        // Actually, helper doesn't support immediate override like that easily with post.
        // We can do manual transformation.
        data.status = status;
        post(route('letters.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pembuatan Surat
                </h2>
            }
        >
            <Head title="Pembuatan Surat" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Sidebar / Form Controls */}
                        <div className="w-1/3 space-y-6">
                            <div className="bg-white p-6 shadow sm:rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Detail Surat</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Pilih Template</label>
                                        <select
                                            value={data.template_type}
                                            onChange={handleTemplateChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">-- Pilih Template --</option>
                                            {templates.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                        {errors.template_type && <span className="text-red-500 text-xs">{errors.template_type}</span>}
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
                                            value={data.meta_data.perihal}
                                            onChange={e => handleMetaChange('perihal', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tujuan Surat</label>
                                        <input
                                            type="text"
                                            value={data.meta_data.tujuan}
                                            onChange={e => handleMetaChange('tujuan', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lampiran</label>
                                        <input
                                            type="text"
                                            value={data.meta_data.lampiran}
                                            onChange={e => handleMetaChange('lampiran', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <hr className="my-4" />
                                    <h4 className="font-medium text-sm text-gray-500">Data Warga (Untuk Template)</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={data.meta_data.nama_lengkap}
                                            onChange={e => handleMetaChange('nama_lengkap', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">NIK</label>
                                        <input
                                            type="text"
                                            value={data.meta_data.nik}
                                            onChange={e => handleMetaChange('nik', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <button
                                        type="button" // Use type button to prevent form submit default
                                        onClick={() => alert('Fitur Preview PDF belum terintegrasi dengan data real-time sebelum save. Silakan simpan draft lalu preview.')}
                                        className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
                                    >
                                        Preview PDF
                                    </button>
                                    <button
                                        onClick={() => submit('draft')}
                                        disabled={processing}
                                        className="w-full bg-gray-200 text-gray-800 rounded py-2 hover:bg-gray-300"
                                    >
                                        Simpan Draft
                                    </button>
                                    <button
                                        onClick={() => submit('sent')}
                                        disabled={processing}
                                        className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700"
                                    >
                                        Kirim Surat
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="w-2/3">
                            <div className="bg-white p-6 shadow sm:rounded-lg min-h-[600px]">
                                <RichTextEditor
                                    content={data.content}
                                    onChange={(html) => setData('content', html)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
