import { Head, useForm, Link, usePage } from '@inertiajs/react';
import Sidebar, { Topbar } from '@/Components/Sidebar';

export default function UserEdit({ user }) {
    const { auth } = usePage().props;
    const currentUser = auth.user;
    
    // Check if current user can edit job info and permissions
    const canEditJobInfo = currentUser.role === 'Kepala Desa' || currentUser.role === 'Sekretaris Desa';
    
    const { data, setData, patch, processing, errors, isDirty } = useForm({
        name: user.name || '',
        nik: user.nik || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        jabatan: user.jabatan || '',
        divisi: user.divisi || '',
        status: user.status || 'Aktif',
        username: user.username || '',
        password: '', // Leave empty to keep existing password
        permissions: user.permissions || {
            kelola_penduduk: false,
            kelola_surat: false,
            kelola_keuangan: false,
            kelola_agenda: false,
            lihat_laporan: false,
            kelola_pengaturan: false,
        }
    });

    const roles = ['Kepala Desa', 'Sekretaris Desa', 'Pegawai Desa'];
    const divisions = ['Umum', 'Keuangan', 'Perencanaan', 'Pemerintahan', 'Kesejahteraan'];
    const statuses = ['Aktif', 'Nonaktif', 'Cuti'];

    const handlePermissionChange = (field) => {
        setData('permissions', {
            ...data.permissions,
            [field]: !data.permissions[field]
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Check if we're on profile edit page or user edit page
        // If URL contains '/profile', use profile.update route with PATCH method
        // Otherwise use users.update route with PATCH method
        const isProfileEdit = window.location.pathname === '/profile';
        
        if (isProfileEdit) {
            patch(route('profile.update'));
        } else {
            patch(route('users.update', user.id));
        }
    };

    const handleBack = (e) => {
        // Determine correct back URL based on context
        const isProfileEdit = window.location.pathname === '/profile';
        const backUrl = isProfileEdit ? '/dashboard' : route('users.index');
        
        // If there are unsaved changes, show confirmation
        if (isDirty) {
            e.preventDefault();
            const confirmed = window.confirm(
                'Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?'
            );
            
            if (confirmed) {
                window.location.href = backUrl;
            }
        }
        // If no changes, let the link work normally
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Edit Akun" />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Topbar pageTitle="Manajemen Akun" />

                <div className="p-6">
                    {/* Success Notification */}
                    {(() => {
                        const { props } = usePage();
                        const success = props.flash?.success || props.success;
                        
                        if (!success) return null;
                        
                        return (
                            <div className="mx-auto max-w-4xl mb-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-green-800">{success}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                    
                    <div className="mx-auto max-w-4xl">
                        {/* Breadcrumbs */}
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                            <span className="mx-2">›</span>
                            {/* Check if user has access to Manajemen Akun */}
                            {(() => {
                                const { auth } = usePage().props;
                                const hasAccess = auth.user.role === 'Kepala Desa' || auth.user.role === 'Sekretaris Desa';
                                
                                return hasAccess ? (
                                    <Link href={route('users.index')} className="hover:text-blue-600">Manajemen Akun</Link>
                                ) : (
                                    <span className="text-gray-400">Manajemen Akun</span>
                                );
                            })()}
                            <span className="mx-2">›</span>
                            <span className="text-gray-900 font-medium">Edit Akun</span>
                        </div>

                        {/* Info Alert */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                ✏️
                            </div>
                            <div>
                                <h3 className="text-blue-900 font-medium">Edit Informasi Akun</h3>
                                <p className="text-blue-700 text-sm mt-1">Perbarui informasi akun pengguna di bawah ini</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">

                            {/* Informasi Pribadi */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Informasi Pribadi</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                                        <input
                                            type="text"
                                            value={data.nik}
                                            onChange={e => {
                                                // Hanya terima angka
                                                const value = e.target.value.replace(/\D/g, '');
                                                // Maksimal 16 digit
                                                if (value.length <= 16) {
                                                    setData('nik', value);
                                                }
                                            }}
                                            placeholder="Masukkan NIK (16 digit)"
                                            maxLength="16"
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.nik && <div className="text-red-500 text-xs mt-1">{errors.nik}</div>}
                                        {data.nik && data.nik.length < 16 && (
                                            <div className="text-yellow-600 text-xs mt-1">NIK harus 16 digit ({data.nik.length}/16)</div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="contoh@email.com"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => {
                                                // Hanya terima angka
                                                const value = e.target.value.replace(/\D/g, '');
                                                // Maksimal 15 digit (standar internasional)
                                                if (value.length <= 15) {
                                                    setData('phone', value);
                                                }
                                            }}
                                            placeholder="08xxxxxxxxxx"
                                            maxLength="15"
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                                        {data.phone && data.phone.length < 10 && (
                                            <div className="text-yellow-600 text-xs mt-1">No. telepon minimal 10 digit</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Jabatan */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                    Informasi Jabatan
                                    {!canEditJobInfo && <span className="text-xs text-gray-500 ml-2">(Hanya dapat dilihat)</span>}
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            disabled={!canEditJobInfo}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!canEditJobInfo ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="">Pilih Jabatan</option>
                                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Divisi/Bagian</label>
                                        <select
                                            value={data.divisi}
                                            onChange={e => setData('divisi', e.target.value)}
                                            disabled={!canEditJobInfo}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!canEditJobInfo ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="">Pilih Divisi</option>
                                            {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        {errors.divisi && <div className="text-red-500 text-xs mt-1">{errors.divisi}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Kepegawaian</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            disabled={!canEditJobInfo}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!canEditJobInfo ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        >
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Pengaturan Akun */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Pengaturan Akun</h3>
                                <div className="max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru (Opsional)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                placeholder="Kosongkan jika tidak diubah"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-400">👁️</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Hanya isi jika ingin mengganti password</p>
                                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Hak Akses */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                    Hak Akses
                                    {!canEditJobInfo && <span className="text-xs text-gray-500 ml-2">(Hanya dapat dilihat)</span>}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`flex items-center space-x-3 ${canEditJobInfo ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.kelola_penduduk}
                                            onChange={() => handlePermissionChange('kelola_penduduk')}
                                            disabled={!canEditJobInfo}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                                        />
                                        <span className="text-gray-700">Kelola Data Penduduk</span>
                                    </label>
                                    <label className={`flex items-center space-x-3 ${canEditJobInfo ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.kelola_agenda}
                                            onChange={() => handlePermissionChange('kelola_agenda')}
                                            disabled={!canEditJobInfo}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                                        />
                                        <span className="text-gray-700">Kelola Agenda</span>
                                    </label>
                                    <label className={`flex items-center space-x-3 ${canEditJobInfo ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.kelola_surat}
                                            onChange={() => handlePermissionChange('kelola_surat')}
                                            disabled={!canEditJobInfo}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                                        />
                                        <span className="text-gray-700">Kelola Surat Menyurat</span>
                                    </label>
                                    <label className={`flex items-center space-x-3 ${canEditJobInfo ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.lihat_laporan}
                                            onChange={() => handlePermissionChange('lihat_laporan')}
                                            disabled={!canEditJobInfo}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                                        />
                                        <span className="text-gray-700">Lihat Laporan</span>
                                    </label>
                                    <label className={`flex items-center space-x-3 ${canEditJobInfo ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.kelola_keuangan}
                                            onChange={() => handlePermissionChange('kelola_keuangan')}
                                            disabled={!canEditJobInfo}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                                        />
                                        <span className="text-gray-700">Kelola Keuangan</span>
                                    </label>
                                    <label className={`flex items-center space-x-3 ${canEditJobInfo ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={data.permissions.kelola_pengaturan}
                                            onChange={() => handlePermissionChange('kelola_pengaturan')}
                                            disabled={!canEditJobInfo}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                                        />
                                        <span className="text-gray-700">Kelola Pengaturan</span>
                                    </label>
                                </div>
                            </div>

                            <hr className="my-6 border-gray-200" />

                            <div className="flex justify-end gap-3">
                                <Link
                                    href={window.location.pathname === '/profile' ? '/dashboard' : route('users.index')}
                                    onClick={handleBack}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Kembali
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
