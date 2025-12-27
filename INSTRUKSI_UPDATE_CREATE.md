# INSTRUKSI UPDATE CREATE.JSX

## Langkah 1: Import helper di bagian atas file
Tambahkan import ini di baris 4 (setelah import Sidebar):
```javascript
import { generateLetterTemplate } from '@/utils/letterTemplates';
```

## Langkah 2: Update function generateTemplateContent
Ganti seluruh function generateTemplateContent (mulai dari baris 36-280 kira-kira) dengan:

```javascript
const generateTemplateContent = (type) => {
    // Get current user data from Inertia page props
    const user = usePage().props.auth.user;
    
    // Use the helper function
    return generateLetterTemplate(type, user);
};
```

## Langkah 3: Hapus field recipient dari form data
Di baris 11, hapus:
```javascript
recipient: '', // Penerima
```

Karena recipient sudah di-handle otomatis di backend.

## Hasil Akhir:
- ✅ Semua template otomatis terisi dengan data user
- ✅ Tanggal otomatis menggunakan tanggal hari ini
- ✅ Nomor surat ada di bawah judul setiap template
- ✅ Format tabel dan spacing sudah benar
- ✅ Auto-generate nomor surat jika field kosong

## Template yang Tersedia:
1. Surat Pengunduran Diri (SPD)
2. Surat Keputusan (SK)
3. Surat Tugas (ST)
4. Surat Perintah Perjalanan Dinas (SPPD)
5. Memo

Semua template sudah include:
- Nomor surat di bawah judul
- Auto-fill nama, jabatan, alamat dari user
- Tanggal otomatis
- Format yang rapi dengan spacing yang benar
