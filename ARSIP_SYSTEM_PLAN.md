# Arsip System Implementation Plan

## Overview
Implementasi sistem arsip untuk Sekretaris Desa dengan fitur folder custom, filtering, dan search.

## Requirements

### 1. Menu & Access
- ✅ **Sekdes**: Menu "Pengelolaan Surat" → "Arsip"
- ✅ **Pegawai & Kades**: Tetap "Pengelolaan Surat"
- ✅ **Tombol "Buat Folder Baru"**: Hanya muncul untuk Sekdes

### 2. Arsip Content
**Kriteria Surat Masuk Arsip:**
- Status: `approved` (Disetujui) ATAU `rejected` (Ditolak) oleh Kepala Desa
- Semua role bisa lihat arsip, tapi hanya Sekdes yang bisa manage folder

### 3. Filter & Search Features
**Filter:**
- By Jenis Surat (dropdown):
  - Semua Jenis
  - Surat Pengunduran Diri
  - Surat Keputusan (SK)
  - SPPD
  - Surat Tugas (ST)
  - Surat Cuti
  - Memo

- By Periode (date range):
  - Hari ini
  - Minggu ini
  - Bulan ini
  - Tahun ini
  - Custom range

- By Status:
  - Semua
  - Disetujui
  - Ditolak

**Search:**
- Search by nama pembuat surat
- Search by nomor surat
- Search by perihal

### 4. Folder System
**Purpose:** Organize arsip ke dalam kategori custom

**Features:**
- Create folder (Sekdes only)
- Rename folder (Sekdes only)
- Delete folder (Sekdes only)
- Move surat to folder (Sekdes only)
- View folder contents (All roles)

**Example Folders:**
- "Surat Meeting Januari 2025"
- "Surat Pegawai Ahmad"
- "Surat Penting"
- "Arsip 2024"

## Database Schema

### Table: `folders` (NEW)
```sql
CREATE TABLE folders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### Table: `letter_folder` (Pivot - NEW)
```sql
CREATE TABLE letter_folder (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    letter_id BIGINT UNSIGNED NOT NULL,
    folder_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);
```

## Implementation Steps

### Phase 1: Backend Setup ✅
1. ✅ Update Sidebar menu
2. ⏳ Create migration for `folders` table
3. ⏳ Create migration for `letter_folder` pivot table
4. ⏳ Create `Folder` model
5. ⏳ Update `Letter` model with folder relationship

### Phase 2: Folder Management
1. ⏳ Create `FolderController`
   - `index()` - List all folders
   - `store()` - Create folder (Sekdes only)
   - `update()` - Rename folder (Sekdes only)
   - `destroy()` - Delete folder (Sekdes only)
   
2. ⏳ Create routes for folder management
3. ⏳ Create folder UI components

### Phase 3: Arsip Page Enhancement
1. ⏳ Update `LetterManagementController`
   - Filter by status (approved/rejected)
   - Filter by template_type
   - Filter by date range
   - Search by name/number/subject
   
2. ⏳ Update `LetterManagement.jsx`
   - Add filter UI
   - Add search bar
   - Add "Buat Folder Baru" button (Sekdes only)
   - Add folder sidebar/list
   - Add "Move to Folder" action (Sekdes only)

### Phase 4: Testing
1. ⏳ Test as Sekdes - Can create/manage folders
2. ⏳ Test as Pegawai - Cannot see folder management
3. ⏳ Test as Kades - Cannot see folder management
4. ⏳ Test filters and search
5. ⏳ Test move surat to folder

## UI Mockup

### Arsip Page Layout (Sekdes)
```
┌─────────────────────────────────────────────────────────┐
│ 📁 Arsip                                    [+ Buat Folder Baru] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Filters:                                                │
│ [Jenis Surat ▼] [Periode ▼] [Status ▼] [🔍 Search...]  │
│                                                         │
├──────────────┬──────────────────────────────────────────┤
│ Folders:     │ Surat List                               │
│              │                                          │
│ 📁 Semua     │ [Table with letters]                     │
│ 📁 Meeting   │ - Nomor Surat                            │
│ 📁 Pegawai X │ - Perihal                                │
│ 📁 Penting   │ - Status                                 │
│              │ - Tanggal                                │
│ [+ Folder]   │ - Actions: [Lihat] [Pindah ke Folder]   │
└──────────────┴──────────────────────────────────────────┘
```

### Arsip Page Layout (Pegawai/Kades)
```
┌─────────────────────────────────────────────────────────┐
│ 📁 Pengelolaan Surat                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Filters:                                                │
│ [Status ▼] [Periode ▼] [🔍 Search...]                   │
│                                                         │
│ [Table with all my letters]                             │
│ - Nomor Surat                                           │
│ - Perihal                                               │
│ - Status                                                │
│ - Tanggal                                               │
│ - Actions: [Lihat] [Edit (if draft/revoked)]           │
└─────────────────────────────────────────────────────────┘
```

## Next Steps

1. Create database migrations
2. Create Folder model
3. Create FolderController
4. Update LetterManagementController with filters
5. Update LetterManagement.jsx UI
6. Test all features

## Notes

- Folder hanya untuk Sekdes
- Surat bisa ada di multiple folders (many-to-many)
- Arsip hanya menampilkan surat yang approved/rejected
- Pengelolaan Surat (Pegawai/Kades) menampilkan semua surat mereka
