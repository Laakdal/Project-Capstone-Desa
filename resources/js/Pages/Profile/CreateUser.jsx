import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar, { Topbar } from '@/Components/Sidebar';
import { useState } from 'react';

export default function CreateUser() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        nik: '',
        email: '',
        phone: '',
        role: '',
        jabatan: '',
        divisi: '',
        status: 'Aktif',
        username: '',
        password: '',
    });

    const roles = ['Kepala Desa', 'Sekretaris Desa', 'Pegawai Desa'];
    const divisions = ['Umum', 'Keuangan', 'Perencanaan', 'Pemerintahan', 'Kesejahteraan'];
    const statuses = ['Aktif', 'Nonaktif', 'Cuti'];



    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Tambah Akun Baru" />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Topbar pageTitle="Manajemen Akun" />

                <div className="p-6">
                    <div className="mx-auto max-w-4xl">
                        {/* Breadcrumbs */}
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                            <span className="mx-2">›</span>
                            <Link href={route('users.index')} className="hover:text-blue-600">Manajemen Akun</Link>
                            <span className="mx-2">›</span>
                            <span className="text-gray-900 font-medium">Tambah Akun</span>
                        </div>

                        {/* Info Alert */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                👤
                            </div>
                            <div>
                                <h3 className="text-blue-900 font-medium">Informasi Akun Baru</h3>
                                <p className="text-blue-700 text-sm mt-1">Lengkapi form di bawah untuk membuat akun baru</p>
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
                                            onChange={e => setData('nik', e.target.value)}
                                            placeholder="Masukkan NIK"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.nik && <div className="text-red-500 text-xs mt-1">{errors.nik}</div>}
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
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Jabatan */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Informasi Jabatan</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role/Peran</label>
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Pilih Role</option>
                                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                                        <input
                                            type="text"
                                            value={data.jabatan}
                                            onChange={e => setData('jabatan', e.target.value)}
                                            placeholder="Masukkan jabatan"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.jabatan && <div className="text-red-500 text-xs mt-1">{errors.jabatan}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Divisi/Bagian</label>
                                        <select
                                            value={data.divisi}
                                            onChange={e => setData('divisi', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                placeholder="Masukkan password"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Password minimal 8 karakter</p>
                                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link
                                    href={route('users.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    ← Kembali
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Reset Form
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                                >
                                    <span>+</span> Buat Akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
