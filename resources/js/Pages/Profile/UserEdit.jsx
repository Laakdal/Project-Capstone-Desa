import { Head, Link, useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { ChevronRight, Camera, User, Briefcase, Shield, ToggleLeft } from 'lucide-react';

export default function UserEdit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user?.name || '',
        nik: user?.nik || '',
        email: user?.email || '',
        phone: user?.phone || '',
        position: user?.position || '',
        nip: user?.nip || '',
        division: user?.division || '',
        join_date: user?.join_date || '',
        role: user?.role || 'Staff',
        permissions: user?.permissions || [],
        status: user?.status === 'Aktif',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/manajemen-akun/${user.id}`);
    };

    const handlePermissionToggle = (permission) => {
        const newPermissions = data.permissions.includes(permission)
            ? data.permissions.filter(p => p !== permission)
            : [...data.permissions, permission];
        setData('permissions', newPermissions);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Edit Akun Pengguna" />
            
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <Topbar pageTitle="Edit Akun Pengguna" />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 max-w-4xl">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Akun Pengguna</h1>
                            <p className="text-sm text-gray-600">Ubah informasi dan role pengguna pegawai internal</p>
                            
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                                <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                                <ChevronRight size={16} />
                                <Link href="/manajemen-akun" className="hover:text-blue-600">Manajemen Pengguna</Link>
                                <ChevronRight size={16} />
                                <span className="text-gray-900 font-medium">Edit Akun</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* User Profile Section */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                        </div>
                                        <button 
                                            type="button"
                                            className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1.5 hover:bg-gray-50"
                                        >
                                            <Camera size={14} className="text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-gray-900">{user?.name || 'Nama User'}</h2>
                                        <p className="text-sm text-gray-600">ID: USR-2024-0015</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Aktif
                                            </span>
                                            <span className="text-xs text-gray-500">Terakhir login: 2 jam yang lalu</span>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Ubah Foto
                                    </button>
                                </div>
                            </div>

                            {/* Informasi Personal */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <User size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Informasi Personal</h3>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Lengkap<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ahmad Fauzi"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            NIK<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nik}
                                            onChange={(e) => setData('nik', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="3201234567890123"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="ahmad.fauzi@desa.go.id"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            No. Telepon
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="081234567890"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Kepegawaian */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Informasi Kepegawaian</h3>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jabatan<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.position}
                                            onChange={(e) => setData('position', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Pilih Jabatan</option>
                                            <option value="Kepala Seksi Pemerintahan">Kepala Seksi Pemerintahan</option>
                                            <option value="Sekretaris Desa">Sekretaris Desa</option>
                                            <option value="Kepala Desa">Kepala Desa</option>
                                            <option value="Staf Administrasi">Staf Administrasi</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            NIP
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nip}
                                            onChange={(e) => setData('nip', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="198503152010011002"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Divisi<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.division}
                                            onChange={(e) => setData('division', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Pilih Divisi</option>
                                            <option value="Seksi Pemerintahan">Seksi Pemerintahan</option>
                                            <option value="Seksi Kesejahteraan">Seksi Kesejahteraan</option>
                                            <option value="Seksi Pembangunan">Seksi Pembangunan</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tanggal Bergabung
                                        </label>
                                        <input
                                            type="date"
                                            value={data.join_date}
                                            onChange={(e) => setData('join_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Role & Hak Akses */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Role & Hak Akses</h3>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4">Tentukan level akses dan permission untuk pengguna ini</p>

                                {/* Role Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Role Pengguna<span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <label className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            data.role === 'Admin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="Admin"
                                                checked={data.role === 'Admin'}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="mt-1"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-semibold text-gray-900">Admin</p>
                                                <p className="text-xs text-gray-600">Akses penuh sistem</p>
                                            </div>
                                        </label>

                                        <label className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            data.role === 'Staff' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="Staff"
                                                checked={data.role === 'Staff'}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="mt-1"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-semibold text-gray-900">Staff</p>
                                                <p className="text-xs text-gray-600">Akses terbatas</p>
                                            </div>
                                        </label>

                                        <label className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            data.role === 'Viewer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="Viewer"
                                                checked={data.role === 'Viewer'}
                                                onChange={(e) => setData('role', e.target.value)}
                                                className="mt-1"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-semibold text-gray-900">Viewer</p>
                                                <p className="text-xs text-gray-600">Hanya lihat data</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Specific Permissions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Hak Akses Spesifik
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes('kelola_dokumen')}
                                                onChange={() => handlePermissionToggle('kelola_dokumen')}
                                                className="mt-1"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">Kelola Dokumen</p>
                                                <p className="text-xs text-gray-600">Upload, edit & hapus dokumen</p>
                                            </div>
                                        </label>

                                        <label className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes('buat_laporan')}
                                                onChange={() => handlePermissionToggle('buat_laporan')}
                                                className="mt-1"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">Buat Laporan</p>
                                                <p className="text-xs text-gray-600">Membuat dan export laporan</p>
                                            </div>
                                        </label>

                                        <label className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes('kelola_pengguna')}
                                                onChange={() => handlePermissionToggle('kelola_pengguna')}
                                                className="mt-1"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">Kelola Pengguna</p>
                                                <p className="text-xs text-gray-600">Tambah, edit pengguna lain</p>
                                            </div>
                                        </label>

                                        <label className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes('pengaturan_sistem')}
                                                onChange={() => handlePermissionToggle('pengaturan_sistem')}
                                                className="mt-1"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">Pengaturan Sistem</p>
                                                <p className="text-xs text-gray-600">Akses pengaturan sistem</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Status Akun */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <ToggleLeft size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Status Akun</h3>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Status Aktif</p>
                                        <p className="text-xs text-gray-600">Pengguna dapat login dan mengakses sistem</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.status}
                                            onChange={(e) => setData('status', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
                                >
                                    Hapus Akun
                                </button>
                                <div className="flex gap-3">
                                    <Link
                                        href="/manajemen-akun"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
