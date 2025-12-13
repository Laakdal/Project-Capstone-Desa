import { Head, useForm } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';
import Sidebar, { Topbar } from '@/Components/Sidebar';
import { useEffect } from 'react';

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
            jabatan: '',
        },
    });

    const templates = [
        { id: 'surat_pengunduran_diri', name: 'Surat Pengunduran Diri' },
        { id: 'surat_keputusan', name: 'Surat Keputusan (SK)' },
        { id: 'surat_perintah_perjalanan_dinas', name: 'Surat Perintah Perjalanan Dinas (SPPD)' },
        { id: 'surat_tugas', name: 'Surat Tugas (ST)' },
        { id: 'memo', name: 'Memo' },
    ];

    const generateTemplateContent = (type) => {
        // NOTE: We do NOT include the header here anymore, as it is handled by PDF template
        // and shown visually above the editor.

        if (type === 'surat_pengunduran_diri') {
            return `
                <div style="font-family: 'Times New Roman', serif;">
                    <div style="text-align: right; margin-bottom: 20px;">
                        <p>Banjarsari, [TANGGAL_SURAT]</p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p>Yth. Kepala Desa Banjarsari</p>
                        <p>di Tempat</p>
                    </div>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold; text-align: center;">SURAT PENGUNDURAN DIRI</h3>
                    </div>
                    <p>Yang bertanda tangan di bawah ini:</p>
                    <table style="border: none; margin-left: 30px; margin-bottom: 15px;">
                        <tbody>
                            <tr><td style="width: 150px;">Nama</td><td>: [NAMA_LENGKAP]</td></tr>
                            <tr><td>Jabatan</td><td>: [JABATAN]</td></tr>
                            <tr><td>Alamat</td><td>: [ALAMAT_LENGKAP]</td></tr>
                        </tbody>
                    </table>
                    <p style="text-align: justify; margin-bottom: 15px;">
                        Dengan ini bermaksud mengajukan pengunduran diri dari jabatan saya sebagai [JABATAN] di Pemerintah Desa Banjarsari, Kecamatan Bayongbong, Kabupaten Garut, terhitung mulai tanggal [TANGGAL_EFEKTIF].
                    </p>
                    <p style="text-align: justify; margin-bottom: 15px;">
                        Saya mengucapkan terima kasih yang sebesar-besarnya atas kesempatan yang telah diberikan kepada saya untuk bekerja di Desa Banjarsari. Saya juga memohon maaf apabila selama bekerja terdapat kesalahan dan kekhilafan.
                    </p>
                    <p>Demikian surat pengunduran diri ini saya buat dengan kesadaran sendiri tanpa ada paksaan dari pihak manapun.</p>
                    <br>
                    <div style="text-align: right; margin-right: 30px;">
                         <p style="text-align: right;">Hormat saya,</p>
                         <br><br><br>
                         <p style="font-weight: bold; text-decoration: underline; text-align: right;">[NAMA_LENGKAP]</p>
                    </div>
                </div>
            `;
        }

        if (type === 'surat_keputusan') {
            return `
                <div style="text-align: center; font-family: 'Times New Roman', serif; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 12pt; font-weight: bold; text-align: center;">KEPUTUSAN KEPALA DESA BANJARSARI</h3>
                    <p style="margin: 0; font-size: 12pt; text-align: center;">NOMOR: [NOMOR_SURAT]</p>
                    <h3 style="margin: 15px 0 5px 0; font-size: 12pt; font-weight: bold; text-align: center;">TENTANG</h3>
                    <h3 style="margin: 0; font-size: 12pt; text-transform: uppercase; font-weight: bold; text-align: center;">[PERIHAL_KEPUTUSAN]</h3>
                    <h3 style="margin: 15px 0 5px 0; font-size: 12pt; font-weight: bold; text-align: center;">KEPALA DESA BANJARSARI,</h3>
                </div>
                <div style="font-family: 'Times New Roman', serif;">
                    <table style="width: 100%; border: none;">
                        <tbody>
                            <tr>
                                <td style="vertical-align: top; width: 100px; font-weight: bold;">Menimbang</td>
                                <td style="vertical-align: top; width: 20px;">:</td>
                                <td style="text-align: justify;">
                                    <ol style="margin: 0; padding-left: 20px;">
                                        <li>bahwa [KONSIDERANS_A];</li>
                                        <li>bahwa [KONSIDERANS_B];</li>
                                    </ol>
                                </td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; font-weight: bold;">Mengingat</td>
                                <td style="vertical-align: top;">:</td>
                                <td style="text-align: justify;">
                                     <ol style="margin: 0; padding-left: 20px;">
                                        <li>Undang-Undang Nomor 6 Tahun 2014 wacana Desa;</li>
                                        <li>[DASAR_HUKUM_LAINNYA];</li>
                                    </ol>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="text-align: center; margin: 20px 0;">
                        <h3 style="margin: 0; font-size: 12pt; font-weight: bold; text-align: center;">MEMUTUSKAN:</h3>
                    </div>
                    <table style="width: 100%; border: none;">
                        <tbody>
                            <tr>
                                <td style="vertical-align: top; width: 100px; font-weight: bold;">Menetapkan</td>
                                <td style="vertical-align: top; width: 20px;">:</td>
                                <td style="font-weight: bold;">[JUDUL_KEPUTUSAN]</td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; font-weight: bold;">KESATU</td>
                                <td style="vertical-align: top;">:</td>
                                <td style="text-align: justify;">[ISI_PUTUSAN_KESATU]</td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; font-weight: bold;">KEDUA</td>
                                <td style="vertical-align: top;">:</td>
                                <td style="text-align: justify;">[ISI_PUTUSAN_KEDUA]</td>
                            </tr>
                            <tr>
                                <td style="vertical-align: top; font-weight: bold;">KETIGA</td>
                                <td style="vertical-align: top;">:</td>
                                <td style="text-align: justify;">Keputusan ini mulai berlaku pada tanggal ditetapkan.</td>
                            </tr>
                        </tbody>
                    </table>
                     <br><br>
                    <div style="float: right; width: 300px;">
                        <p>Ditetapkan di: Banjarsari</p>
                        <p>Pada tanggal: [TANGGAL_SURAT]</p>
                        <p style="margin-top: 10px;">Kepala Desa Banjarsari,</p>
                        <br><br><br>
                        <p style="font-weight: bold; text-decoration: underline;">[NAMA_KEPALA_DESA]</p>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            `;
        }

        if (type === 'surat_perintah_perjalanan_dinas') {
            return `
                <div style="text-align: center; font-family: 'Times New Roman', serif; margin-bottom: 20px;">
                    <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold; text-align: center;">SURAT PERINTAH PERJALANAN DINAS</h3>
                    <p style="margin: 0; font-size: 12pt; text-align: center;">Nomor : [NOMOR_SURAT]</p>
                </div>
                <div style="font-family: 'Times New Roman', serif;">
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
                        <tbody>
                            <tr><td style="border: 1px solid black; padding: 5px;">1.</td><td style="border: 1px solid black; padding: 5px;">Pejabat berwenang yang memberi perintah</td><td style="border: 1px solid black; padding: 5px;">Kepala Desa Banjarsari</td></tr>
                            <tr><td style="border: 1px solid black; padding: 5px;">2.</td><td style="border: 1px solid black; padding: 5px;">Nama Pegawai yang diperintah</td><td style="border: 1px solid black; padding: 5px;">[NAMA_PEGAWAI]</td></tr>
                            <tr><td style="border: 1px solid black; padding: 5px;">3.</td><td style="border: 1px solid black; padding: 5px;">a. Pangkat dan Golongan<br>b. Jabatan / Instansi<br>c. Tingkat Biaya Perjalanan Dinas</td><td style="border: 1px solid black; padding: 5px;">a. [PANGKAT]<br>b. [JABATAN]<br>c. [TINGKAT_BIAYA]</td></tr>
                            <tr><td style="border: 1px solid black; padding: 5px;">4.</td><td style="border: 1px solid black; padding: 5px;">Maksud Perjalanan Dinas</td><td style="border: 1px solid black; padding: 5px;">[MAKSUD_PERJALANAN]</td></tr>
                            <tr><td style="border: 1px solid black; padding: 5px;">5.</td><td style="border: 1px solid black; padding: 5px;">Alat angkut yang dipergunakan</td><td style="border: 1px solid black; padding: 5px;">[ALAT_ANGKUT]</td></tr>
                            <tr><td style="border: 1px solid black; padding: 5px;">6.</td><td style="border: 1px solid black; padding: 5px;">a. Tempat Berangkat<br>b. Tempat Tujuan</td><td style="border: 1px solid black; padding: 5px;">a. Desa Banjarsari<br>b. [TEMPAT_TUJUAN]</td></tr>
                            <tr><td style="border: 1px solid black; padding: 5px;">7.</td><td style="border: 1px solid black; padding: 5px;">a. Lamanya Perjalanan Dinas<br>b. Tanggal Berangkat<br>c. Tanggal Harus Kembali</td><td style="border: 1px solid black; padding: 5px;">a. [LAMA_HARI] hari<br>b. [TGL_BERANGKAT]<br>c. [TGL_KEMBALI]</td></tr>
                        </tbody>
                    </table>
                    <br>
                     <div style="float: right; width: 300px; text-align: left;">
                        <p>Dikeluarkan di: Banjarsari</p>
                        <p>Pada tanggal: [TANGGAL_SURAT]</p>
                        <p style="margin-top: 10px;">Kepala Desa Banjarsari,</p>
                        <br><br><br>
                        <p style="font-weight: bold; text-decoration: underline;">[NAMA_KEPALA_DESA]</p>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            `;
        }

        if (type === 'surat_tugas') {
            return `
                <div style="text-align: center; font-family: 'Times New Roman', serif; margin-bottom: 20px;">
                    <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold; text-align: center;">SURAT TUGAS</h3>
                    <p style="margin: 0; font-size: 12pt; text-align: center;">Nomor : [NOMOR_SURAT]</p>
                </div>
                <div style="font-family: 'Times New Roman', serif;">
                    <p>Yang bertanda tangan di bawah ini:</p>
                    <table style="border: none; margin-left: 30px;">
                        <tbody>
                            <tr><td style="width: 150px;">Nama</td><td>: [NAMA_KEPALA_DESA]</td></tr>
                            <tr><td>Jabatan</td><td>: Kepala Desa Banjarsari</td></tr>
                        </tbody>
                    </table>
                    <p style="margin-top: 15px;">Memberikan tugas kepada:</p>
                    <table style="border: none; margin-left: 30px;">
                        <tbody>
                            <tr><td style="width: 150px;">Nama</td><td>: [NAMA_PEGAWAI]</td></tr>
                            <tr><td>Jabatan</td><td>: [JABATAN]</td></tr>
                        </tbody>
                    </table>
                    <p style="margin-top: 15px; text-align: justify;">
                        Untuk melaksanakan tugas [DESKRIPSI_TUGAS] yang akan dilaksanakan pada:
                    </p>
                    <table style="border: none; margin-left: 30px;">
                        <tbody>
                            <tr><td style="width: 150px;">Hari/Tanggal</td><td>: [HARI_TANGGAL]</td></tr>
                            <tr><td>Waktu</td><td>: [WAKTU]</td></tr>
                            <tr><td>Tempat</td><td>: [TEMPAT]</td></tr>
                        </tbody>
                    </table>
                    <p style="margin-top: 15px; text-align: justify;">
                        Demikian surat tugas ini diberikan untuk dapat dilaksanakan dengan penuh tanggung jawab.
                    </p>
                    <br><br>
                    <div style="float: right; width: 300px; text-align: left;">
                        <p>Banjarsari, [TANGGAL_SURAT]</p>
                        <p>Kepala Desa Banjarsari,</p>
                        <br><br><br>
                        <p style="font-weight: bold; text-decoration: underline;">[NAMA_KEPALA_DESA]</p>
                    </div>
                </div>
            `;
        }

        if (type === 'memo') {
            return `
                <div style="font-family: 'Times New Roman', serif; border: 2px solid black; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; text-decoration: underline; font-weight: bold; text-align: center;">MEMO INTERNAL</h2>
                    </div>
                    <table style="width: 100%; margin-bottom: 20px;">
                        <tbody>
                            <tr>
                                <td style="font-weight: bold; width: 100px;">Dari</td>
                                <td>: [PENGIRIM]</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">Kepada</td>
                                <td>: [PENERIMA]</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">Tanggal</td>
                                <td>: [TANGGAL_SURAT]</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">Perihal</td>
                                <td>: [PERIHAL]</td>
                            </tr>
                        </tbody>
                    </table>
                    <hr style="border-top: 2px solid black; margin-bottom: 20px;">
                    <div style="min-height: 200px;">
                        [ISI_MEMO]
                    </div>
                    <br>
                    <div style="float: right;">
                        <p style="font-weight: bold;">[PENGIRIM]</p>
                    </div>
                    <div style="clear: both;"></div>
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
        post(route('letters.store'));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Pembuatan Surat" />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Topbar pageTitle="Pembuatan Surat" />

                <div className="p-6">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex gap-6">
                            {/* Form Controls */}
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

                                        <hr className="my-4" />
                                        <h4 className="font-medium text-sm text-gray-500">Data Pegawai/Terkait</h4>
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
                                            <label className="block text-sm font-medium text-gray-700">Jabatan</label>
                                            <input
                                                type="text"
                                                value={data.meta_data.jabatan}
                                                onChange={e => handleMetaChange('jabatan', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-2">
                                        <button
                                            onClick={() => submit('draft')}
                                            disabled={processing}
                                            className="w-full bg-gray-200 text-gray-800 rounded py-2 hover:bg-gray-300"
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
                                            className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700"
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
        </div>
    );
}
