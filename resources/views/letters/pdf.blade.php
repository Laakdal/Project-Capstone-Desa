<!DOCTYPE html>
<html>
<head>
    <title>Surat Desa</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; }
        .header { text-align: center; border-bottom: 3px double black; padding-bottom: 10px; margin-bottom: 20px; }
        .header h3, .header h4 { margin: 0; }
        .content { margin: 0 50px; }
        .signature { margin-top: 50px; text-align: right; }
        .signature p { margin: 0; }
        table { width: 100%; }
        td { vertical-align: top; }
        ul, ol { margin-top: 0; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h3>PEMERINTAH KABUPATEN [NAMA_KABUPATEN]</h3>
        <h3>KECAMATAN [NAMA_KECAMATAN]</h3>
        <h2>DESA SUKAMAJU</h2>
        <p>Alamat: Jl. Raya Sukamaju No. 123, Kode Pos 12345</p>
    </div>

    <div class="content">
        {!! $letter->content !!}
    </div>
</body>
</html>
