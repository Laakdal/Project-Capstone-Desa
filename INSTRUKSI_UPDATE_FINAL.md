# INSTRUKSI UPDATE - MEMO & SURAT CUTI

## ✅ File yang Sudah Diupdate:
- resources/js/utils/letterTemplates.js ✅ (Sudah ada Memo fix & Surat Cuti)

## 📝 File yang Perlu Diupdate Manual (2 file):

---

### 1️⃣ UPDATE: app/Http/Controllers/LetterController.php

**Lokasi:** Baris 194-201

**SEBELUM:**
```php
// Define prefixes for each template type
$prefixes = [
    'surat_pengunduran_diri' => 'SPD',
    'surat_keputusan' => 'SK',
    'surat_tugas' => 'ST',
    'surat_perintah_perjalanan_dinas' => 'SPPD',
    'memo' => 'MEMO',
];
```

**SESUDAH:** (Tambahkan 1 baris)
```php
// Define prefixes for each template type
$prefixes = [
    'surat_pengunduran_diri' => 'SPD',
    'surat_keputusan' => 'SK',
    'surat_tugas' => 'ST',
    'surat_perintah_perjalanan_dinas' => 'SPPD',
    'surat_cuti' => 'SC',  // ← TAMBAHKAN BARIS INI
    'memo' => 'MEMO',
];
```

---

### 2️⃣ UPDATE: resources/js/Pages/Letters/Create.jsx

**Lokasi:** Sekitar baris 30-35

**SEBELUM:**
```javascript
const templates = [
    { id: 'surat_pengunduran_diri', name: 'Surat Pengunduran Diri' },
    { id: 'surat_keputusan', name: 'Surat Keputusan (SK)' },
    { id: 'surat_perintah_perjalanan_dinas', name: 'Surat Perintah Perjalanan Dinas (SPPD)' },
    { id: 'surat_tugas', name: 'Surat Tugas (ST)' },
    { id: 'memo', name: 'Memo' },
];
```

**SESUDAH:** (Tambahkan 1 baris)
```javascript
const templates = [
    { id: 'surat_pengunduran_diri', name: 'Surat Pengunduran Diri' },
    { id: 'surat_keputusan', name: 'Surat Keputusan (SK)' },
    { id: 'surat_perintah_perjalanan_dinas', name: 'Surat Perintah Perjalanan Dinas (SPPD)' },
    { id: 'surat_tugas', name: 'Surat Tugas (ST)' },
    { id: 'surat_cuti', name: 'Surat Cuti' },  // ← TAMBAHKAN BARIS INI
    { id: 'memo', name: 'Memo' },
];
```

---

### 3️⃣ BONUS: Update Create.jsx untuk menggunakan template helper

**Lokasi:** Sekitar baris 1-5 (Import section)

**TAMBAHKAN import ini:**
```javascript
import { generateLetterTemplate } from '@/utils/letterTemplates';
```

**Lokasi:** Sekitar baris 36-280 (Function generateTemplateContent)

**GANTI seluruh function dengan:**
```javascript
const generateTemplateContent = (type) => {
    const user = usePage().props.auth.user;
    return generateLetterTemplate(type, user);
};
```

---

## 🎯 Hasil Akhir:

Setelah update 2 file di atas, sistem akan memiliki:

✅ 6 Template Surat:
1. Surat Pengunduran Diri (SPD/001/2025)
2. Surat Keputusan (SK/001/2025)
3. Surat Tugas (ST/001/2025)
4. SPPD (SPPD/001/2025)
5. **Surat Cuti (SC/001/2025)** ← NEW!
6. Memo (MEMO/001/2025) ← FIXED FORMAT!

✅ Fitur:
- Auto-generate nomor surat
- Auto-fill data user (nama, jabatan, alamat)
- Auto-fill tanggal hari ini
- Format rapi (tidak jadi 1 baris)
- Nomor surat di bawah judul

## 📍 Lokasi File:
1. `d:\GIT\Project-Capstone-Desa\app\Http\Controllers\LetterController.php` (line 200)
2. `d:\GIT\Project-Capstone-Desa\resources\js\Pages\Letters\Create.jsx` (line 34)
