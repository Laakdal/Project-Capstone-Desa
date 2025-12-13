<!DOCTYPE html>
<html>
<head>
    <title>Surat Desa</title>
    <style>
        /* CSS untuk Pengaturan Halaman */
        @page {
            /* Atur margin agar ada ruang untuk kop surat */
            margin-top: 4.5cm; /* Increased to accommodate the taller header */
            margin-left: 2.5cm;
            margin-right: 2.5cm;
            margin-bottom: 2cm;
        }

        /* CSS untuk Kop Surat */
        .header {
            position: fixed;
            top: -4cm;
            left: 0;
            right: 0;
            height: 4cm;
            /* Border bottom handled by the border div below the table */
        }
        
        /* Table Layout for Header */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            border: 0;
        }
        
        .header-table td {
            vertical-align: middle;
            padding: 0;
        }

        .logo-cell {
            width: 15%; /* Adjusted width */
            text-align: center;
        }
        
        .logo-cell img {
            height: 90px;
            width: auto;
        }

        .text-cell {
            width: 85%;
            text-align: center;
            padding-right: 15%; /* To balance the centered text visually against the logo on the left */
        }
        
        .header-text p {
            margin: 0;
            line-height: 1.1;
            font-size: 14pt; 
            font-weight: bold;
            font-family: 'Times New Roman', serif;
            color: black;
        }

        .header-text .judul-utama {
            font-size: 18pt; 
            font-weight: 900;
            text-transform: uppercase;
        }
        
        .header-text .alamat {
            font-size: 11pt;
            font-weight: normal;
            font-style: italic;
            margin-top: 5px;
        }
        
        .header-line {
            border-bottom: 3px solid #8B4513;
            margin-top: 10px;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="header">
        <table class="header-table">
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('logo_desa.png') }}" alt="Logo Desa">
                </td>
                <td class="text-cell">
                    <div class="header-text">
                        <p>PEMERINTAH KABUPATEN GARUT</p>
                        <p>KECAMATAN BAYONGBONG</p>
                        <p class="judul-utama">DESA BANJARSARI</p>
                        <p class="alamat">Alamat : Jln. Ciloa No. 09 Banjarsari Bayongbong Garut - 44162</p>
                    </div>
                </td>
            </tr>
        </table>
        <div class="header-line"></div>
    </div>
    
    <div class="content">
        {!! $letterContent !!}
    </div>

</body>
</html>
