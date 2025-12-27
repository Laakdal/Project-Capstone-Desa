// Template Generator Helper
// Using HTML tags that Tiptap editor supports (center tag, align attribute)

export const generateLetterTemplate = (type, user) => {
    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const templates = {
        surat_pengunduran_diri: () => `
                <center>
                    <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold;">SURAT PENGUNDURAN DIRI</h3>
                    <p style="margin: 5px 0 0 0;">Nomor: [NOMOR_SURAT]</p>
                </center>
                <p></p>
                <p align="right">Banjarsari, ${today}</p>
                <p></p>
                <p>Yth. Kepala Desa Banjarsari</p>
                <p>di Tempat</p>
                <p></p>
                <p>Yang bertanda tangan di bawah ini:</p>
                <table style="margin-left: 30px;">
                    <tbody>
                        <tr><td style="width: 150px;">Nama</td><td>: ${user.name || '[NAMA_LENGKAP]'}</td></tr>
                        <tr><td>Jabatan</td><td>: ${user.role || '[JABATAN]'}</td></tr>
                        <tr><td>Alamat</td><td>: ${user.address || '[ALAMAT_LENGKAP]'}</td></tr>
                    </tbody>
                </table>
                <p></p>
                <p style="text-align: justify;">Dengan ini bermaksud mengajukan pengunduran diri dari jabatan saya sebagai ${user.role || '[JABATAN]'} di Pemerintah Desa Banjarsari, Kecamatan Bayongbong, Kabupaten Garut, terhitung mulai tanggal [TANGGAL_EFEKTIF].</p>
                <p></p>
                <p style="text-align: justify;">Saya mengucapkan terima kasih yang sebesar-besarnya atas kesempatan yang telah diberikan kepada saya untuk bekerja di Desa Banjarsari. Saya juga memohon maaf apabila selama bekerja terdapat kesalahan dan kekhilafan.</p>
                <p></p>
                <p>Demikian surat pengunduran diri ini saya buat dengan kesadaran sendiri tanpa ada paksaan dari pihak manapun.</p>
                <p></p>
                <p></p>
                <p align="right">Hormat saya,</p>
                <p></p>
                <p></p>
                <p></p>
                <p align="right"><strong><u>${user.name || '[NAMA_LENGKAP]'}</u></strong></p>
            `,

        surat_keputusan: () => `
                <center>
                    <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold;">SURAT KEPUTUSAN</h3>
                    <p style="margin: 5px 0 0 0;">Nomor: [NOMOR_SURAT]</p>
                </center>
                <p></p>
                <center>
                    <p><strong>TENTANG</strong></p>
                    <p><strong>[PERIHAL_SK]</strong></p>
                </center>
                <p></p>
                <center><p><strong>KEPALA DESA BANJARSARI</strong></p></center>
                <p></p>
                <table>
                    <tbody>
                        <tr>
                            <td style="width: 120px; vertical-align: top;">Menimbang</td>
                            <td style="vertical-align: top;">:</td>
                            <td style="vertical-align: top;">
                                <p>a. [PERTIMBANGAN_1]</p>
                                <p>b. [PERTIMBANGAN_2]</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="vertical-align: top;">Mengingat</td>
                            <td style="vertical-align: top;">:</td>
                            <td style="vertical-align: top;">
                                <p>1. [DASAR_HUKUM_1]</p>
                                <p>2. [DASAR_HUKUM_2]</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p></p>
                <center><p><strong>MEMUTUSKAN</strong></p></center>
                <p></p>
                <table>
                    <tbody>
                        <tr>
                            <td style="width: 120px; vertical-align: top;">Menetapkan</td>
                            <td style="vertical-align: top;">:</td>
                            <td style="vertical-align: top;">[ISI_KEPUTUSAN]</td>
                        </tr>
                    </tbody>
                </table>
                <p></p>
                <p></p>
                <p>Ditetapkan di : Banjarsari</p>
                <p>Pada tanggal : ${today}</p>
                <p></p>
                <p></p>
                <p align="right">Kepala Desa Banjarsari,</p>
                <p></p>
                <p></p>
                <p></p>
                <p align="right"><strong><u>[NAMA_KEPALA_DESA]</u></strong></p>
            `,

        surat_tugas: () => `
                <center>
                    <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold;">SURAT TUGAS</h3>
                    <p style="margin: 5px 0 0 0;">Nomor: [NOMOR_SURAT]</p>
                </center>
                <p></p>
                <p>Yang bertanda tangan di bawah ini:</p>
                <table style="margin-left: 30px;">
                    <tbody>
                        <tr><td style="width: 150px;">Nama</td><td>: [NAMA_PEMBERI_TUGAS]</td></tr>
                        <tr><td>Jabatan</td><td>: Kepala Desa Banjarsari</td></tr>
                    </tbody>
                </table>
                <p></p>
                <p>Dengan ini memberikan tugas kepada:</p>
                <table style="margin-left: 30px;">
                    <tbody>
                        <tr><td style="width: 150px;">Nama</td><td>: ${user.name || '[NAMA_LENGKAP]'}</td></tr>
                        <tr><td>Jabatan</td><td>: ${user.role || '[JABATAN]'}</td></tr>
                        <tr><td>Alamat</td><td>: ${user.address || '[ALAMAT_LENGKAP]'}</td></tr>
                    </tbody>
                </table>
                <p></p>
                <p>Untuk melaksanakan tugas:</p>
                <p style="margin-left: 30px;">[URAIAN_TUGAS]</p>
                <p></p>
                <p>Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab.</p>
                <p></p>
                <p></p>
                <p align="right">Banjarsari, ${today}</p>
                <p align="right">Kepala Desa Banjarsari,</p>
                <p></p>
                <p></p>
                <p></p>
                <p align="right"><strong><u>[NAMA_KEPALA_DESA]</u></strong></p>
            `,

        surat_perintah_perjalanan_dinas: () => `
                <center>
                    <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold;">SURAT PERINTAH PERJALANAN DINAS (SPPD)</h3>
                    <p style="margin: 5px 0 0 0;">Nomor: [NOMOR_SURAT]</p>
                </center>
                <p></p>
                <table style="border: 1px solid black; border-collapse: collapse; width: 100%;">
                    <tbody>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px; width: 30%;">1. Pejabat yang memberi perintah</td>
                            <td style="border: 1px solid black; padding: 8px;">: [NAMA_PEJABAT]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">2. Nama/NIP yang diperintah</td>
                            <td style="border: 1px solid black; padding: 8px;">: ${user.name || '[NAMA_LENGKAP]'} / ${user.nik || '[NIP]'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">3. a. Pangkat dan Golongan</td>
                            <td style="border: 1px solid black; padding: 8px;">: [PANGKAT_GOLONGAN]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">   b. Jabatan/Instansi</td>
                            <td style="border: 1px solid black; padding: 8px;">: ${user.role || '[JABATAN]'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">   c. Tingkat biaya perjalanan dinas</td>
                            <td style="border: 1px solid black; padding: 8px;">: [TINGKAT_BIAYA]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">4. Maksud perjalanan dinas</td>
                            <td style="border: 1px solid black; padding: 8px;">: [MAKSUD_PERJALANAN]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">5. Alat angkutan yang dipergunakan</td>
                            <td style="border: 1px solid black; padding: 8px;">: [ALAT_ANGKUTAN]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">6. a. Tempat berangkat</td>
                            <td style="border: 1px solid black; padding: 8px;">: Banjarsari</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">   b. Tempat tujuan</td>
                            <td style="border: 1px solid black; padding: 8px;">: [TEMPAT_TUJUAN]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">7. a. Lamanya perjalanan dinas</td>
                            <td style="border: 1px solid black; padding: 8px;">: [LAMA_HARI] hari</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">   b. Tanggal berangkat</td>
                            <td style="border: 1px solid black; padding: 8px;">: [TANGGAL_BERANGKAT]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">   c. Tanggal harus kembali</td>
                            <td style="border: 1px solid black; padding: 8px;">: [TANGGAL_KEMBALI]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">8. Pengikut</td>
                            <td style="border: 1px solid black; padding: 8px;">: [NAMA_PENGIKUT]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">9. Pembebanan anggaran</td>
                            <td style="border: 1px solid black; padding: 8px;">: [SUMBER_ANGGARAN]</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">10. Keterangan lain-lain</td>
                            <td style="border: 1px solid black; padding: 8px;">: [KETERANGAN]</td>
                        </tr>
                    </tbody>
                </table>
                <p></p>
                <p align="right">Dikeluarkan di : Banjarsari</p>
                <p align="right">Pada tanggal : ${today}</p>
                <p align="right">Kepala Desa Banjarsari,</p>
                <p></p>
                <p></p>
                <p></p>
                <p align="right"><strong><u>[NAMA_KEPALA_DESA]</u></strong></p>
            `,

        memo: () => `
                <center>
                    <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold;">MEMO INTERNAL</h3>
                    <p style="margin: 5px 0 0 0;">Nomor: [NOMOR_SURAT]</p>
                </center>
                <p></p>
                <table>
                    <tbody>
                        <tr><td style="width: 120px;">Dari</td><td>: ${user.name || '[PENGIRIM]'}</td></tr>
                        <tr><td>Kepada</td><td>: [PENERIMA]</td></tr>
                        <tr><td>Tanggal</td><td>: ${today}</td></tr>
                        <tr><td>Perihal</td><td>: [PERIHAL]</td></tr>
                    </tbody>
                </table>
                <p></p>
                <hr>
                <p></p>
                <p>[ISI_MEMO]</p>
                <p></p>
                <p>Demikian memo ini disampaikan untuk dapat ditindaklanjuti.</p>
                <p></p>
                <p></p>
                <p align="right">${user.name || '[PENGIRIM]'}</p>
                <p align="right">${user.role || '[JABATAN]'}</p>
            `,

        surat_cuti: () => `
                <center>
                    <h3 style="text-decoration: underline; margin: 0; font-size: 12pt; font-weight: bold;">SURAT PERMOHONAN CUTI</h3>
                    <p style="margin: 5px 0 0 0;">Nomor: [NOMOR_SURAT]</p>
                </center>
                <p></p>
                <p align="right">Banjarsari, ${today}</p>
                <p></p>
                <p>Yth. Kepala Desa Banjarsari</p>
                <p>di Tempat</p>
                <p></p>
                <p>Dengan hormat,</p>
                <p>Yang bertanda tangan di bawah ini:</p>
                <table style="margin-left: 30px;">
                    <tbody>
                        <tr><td style="width: 150px;">Nama</td><td>: ${user.name || '[NAMA_LENGKAP]'}</td></tr>
                        <tr><td>Jabatan</td><td>: ${user.role || '[JABATAN]'}</td></tr>
                        <tr><td>Alamat</td><td>: ${user.address || '[ALAMAT_LENGKAP]'}</td></tr>
                    </tbody>
                </table>
                <p></p>
                <p>Dengan ini mengajukan permohonan cuti dengan keterangan sebagai berikut:</p>
                <table style="margin-left: 30px;">
                    <tbody>
                        <tr><td style="width: 180px;">Jenis Cuti</td><td>: [JENIS_CUTI]</td></tr>
                        <tr><td>Alasan Cuti</td><td>: [ALASAN_CUTI]</td></tr>
                        <tr><td>Lama Cuti</td><td>: [LAMA_CUTI] hari</td></tr>
                        <tr><td>Mulai Tanggal</td><td>: [TANGGAL_MULAI]</td></tr>
                        <tr><td>Sampai Tanggal</td><td>: [TANGGAL_SELESAI]</td></tr>
                        <tr><td>Alamat Selama Cuti</td><td>: [ALAMAT_SELAMA_CUTI]</td></tr>
                    </tbody>
                </table>
                <p></p>
                <p>Demikian permohonan cuti ini saya ajukan. Atas perhatian dan perkenannya, saya ucapkan terima kasih.</p>
                <p></p>
                <p></p>
                <p align="right">Hormat saya,</p>
                <p></p>
                <p></p>
                <p></p>
                <p align="right"><strong><u>${user.name || '[NAMA_LENGKAP]'}</u></strong></p>
            `
    };

    return templates[type] ? templates[type]() : '';
};
