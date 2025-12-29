import { Head, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { FileText, Clock, CheckCircle, Users, Search, Edit, Inbox } from 'lucide-react';
import { toast } from 'react-toastify';

// Color system - single source of truth
const COLORS = {
    blue: { gradient: 'from-blue-50 to-blue-100', iconBg: 'bg-blue-200', text: 'text-blue-700', mini: 'bg-blue-100 text-blue-800' },
    green: { gradient: 'from-green-50 to-green-100', iconBg: 'bg-green-200', text: 'text-green-700', mini: 'bg-green-100 text-green-800' },
    yellow: { gradient: 'from-yellow-50 to-yellow-100', iconBg: 'bg-yellow-200', text: 'text-yellow-700', mini: 'bg-yellow-100 text-yellow-800' },
    red: { gradient: 'from-red-50 to-red-100', iconBg: 'bg-red-200', text: 'text-red-700', mini: 'bg-red-100 text-red-800' },
    orange: { gradient: 'from-orange-50 to-orange-100', iconBg: 'bg-orange-200', text: 'text-orange-700', mini: 'bg-orange-100 text-orange-800' },
    gray: { gradient: 'from-gray-50 to-gray-100', iconBg: 'bg-gray-200', text: 'text-gray-700', mini: 'bg-gray-100 text-gray-800' },
};

export default function Dashboard({ statistics, myStatistics, pendingActions, pendingLetters, userRole }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const renderDashboard = () => {
        switch (userRole) {
            case 'Pegawai Desa':
                return <PegawaiDashboard pendingActions={pendingActions} pendingLetters={pendingLetters} myStatistics={myStatistics} />;
            case 'Sekretaris Desa':
                return <SekdesDashboard pendingActions={pendingActions} pendingLetters={pendingLetters} statistics={statistics} />;
            case 'Kepala Desa':
                return <KadesDashboard pendingActions={pendingActions} pendingLetters={pendingLetters} statistics={statistics} />;
            default:
                return <div className="p-6 text-center text-red-600">Role tidak valid</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Head title="Dashboard" />
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6">
                    {renderDashboard()}
                </main>
            </div>
        </div>
    );
}

// Pegawai Dashboard
function PegawaiDashboard({ pendingActions, pendingLetters, myStatistics }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Draft Surat" value={pendingActions.drafts || 0} icon={Edit} color="blue" link="/surat/create" />
                <StatCard title="Menunggu Persetujuan" value={pendingActions.waiting_approval || 0} icon={Clock} color="yellow" />
                <StatCard title="Disposisi Masuk" value={pendingActions.dispositions || 0} icon={Inbox} color="green" />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Surat Saya</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MiniStatCard label="Total" value={myStatistics.total} color="gray" />
                    <MiniStatCard label="Disetujui" value={myStatistics.approved} color="green" />
                    <MiniStatCard label="Ditolak" value={myStatistics.rejected} color="red" />
                    <MiniStatCard label="Dicabut" value={myStatistics.revoked} color="orange" />
                </div>
            </div>

            {pendingLetters && pendingLetters.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Surat Saya yang Perlu Tindakan</h2>
                    </div>
                    <LettersTable letters={pendingLetters} />
                </div>
            )}
        </div>
    );
}

// Kepala Desa Dashboard
function KadesDashboard({ pendingActions, pendingLetters, statistics }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Perlu Persetujuan" value={pendingActions.pending_approval || 0} icon={CheckCircle} color="red" />
                <StatCard title="Disetujui Bulan Ini" value={pendingActions.approved_this_month || 0} icon={FileText} color="green" />
                <StatCard title="Total Bulan Ini" value={pendingActions.total_this_month || 0} icon={FileText} color="blue" />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik Sistem</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MiniStatCard label="Total Surat" value={statistics.total_letters} color="blue" />
                    <MiniStatCard label="Disetujui" value={statistics.approved} color="green" />
                    <MiniStatCard label="Ditolak" value={statistics.rejected} color="red" />
                    <MiniStatCard label="Draft" value={statistics.draft} color="gray" />
                </div>
            </div>

            {pendingLetters && pendingLetters.length > 0 ? (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Surat Menunggu Persetujuan</h2>
                        <p className="text-sm text-gray-600 mt-1">Segera tindaklanjuti surat-surat berikut</p>
                    </div>
                    <LettersTable letters={pendingLetters} showApprovalActions={true} />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Surat Pending</h3>
                    <p className="text-gray-600">Semua surat sudah ditindaklanjuti</p>
                </div>
            )}
        </div>
    );
}

// Sekretaris Desa Dashboard
function SekdesDashboard({ pendingActions, pendingLetters, statistics }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Perlu Verifikasi" value={pendingActions.pending_review || 0} icon={Search} color="yellow" />
                <StatCard title="Surat Bulan Ini" value={pendingActions.total_this_month || 0} icon={Edit} color="blue" />
                <StatCard title="Pengguna Aktif" value={pendingActions.active_users || 0} icon={Users} color="green" />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik Sistem</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MiniStatCard label="Total Surat" value={statistics.total_letters} color="blue" />
                    <MiniStatCard label="Terkirim" value={statistics.sent} color="yellow" />
                    <MiniStatCard label="Disetujui" value={statistics.approved} color="green" />
                    <MiniStatCard label="Ditolak" value={statistics.rejected} color="red" />
                </div>
            </div>

            {pendingLetters && pendingLetters.length > 0 ? (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Surat Perlu Verifikasi</h2>
                        <p className="text-sm text-gray-600 mt-1">Review dan teruskan ke Kepala Desa</p>
                    </div>
                    <LettersTable letters={pendingLetters} showReviewActions={true} />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Surat Pending</h3>
                    <p className="text-gray-600">Semua surat sudah diverifikasi</p>
                </div>
            )}
        </div>
    );
}

// Reusable Components
function StatCard({ title, value, icon: Icon, color, link }) {
    const c = COLORS[color];
    const card = (
        <div className={`bg-gradient-to-br ${c.gradient} rounded-lg p-6 shadow-sm transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
                </div>
                <div className={`${c.iconBg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${c.text}`} />
                </div>
            </div>
        </div>
    );
    return link ? <Link href={link}>{card}</Link> : card;
}

function MiniStatCard({ label, value, color }) {
    const c = COLORS[color];
    return (
        <div className="text-center">
            <div className={`${c.mini} rounded-lg p-4`}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs font-medium mt-1">{label}</p>
            </div>
        </div>
    );
}

function LettersTable({ letters, showReviewActions, showApprovalActions }) {
    const getStatusBadge = (status) => {
        const badges = {
            'draft': { label: 'Draft', bg: 'bg-gray-100 text-gray-800' },
            'sent': { label: 'Terkirim', bg: 'bg-yellow-100 text-yellow-800' },
            'continued': { label: 'Diteruskan', bg: 'bg-blue-100 text-blue-800' },
            'approved': { label: 'Disetujui', bg: 'bg-green-100 text-green-800' },
            'rejected': { label: 'Ditolak', bg: 'bg-red-100 text-red-800' },
            'revoked': { label: 'Dicabut', bg: 'bg-orange-100 text-orange-800' },
        };
        const badge = badges[status] || { label: status, bg: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.bg}`}>{badge.label}</span>;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Surat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perihal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pembuat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {letters.map((letter) => (
                        <tr key={letter.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{letter.letter_number || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{letter.subject || letter.template_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{letter.user?.name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(letter.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(letter.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {showReviewActions && <a href={`/arsip/${letter.id}/pdf`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 font-medium">Review</a>}
                                {showApprovalActions && <Link href={`/kepala-desa/approval/${letter.id}`} className="text-green-600 hover:text-green-900 font-medium">Setujui</Link>}
                                {!showReviewActions && !showApprovalActions && <Link href={`/surat/${letter.id}`} className="text-blue-600 hover:text-blue-900 font-medium">Lihat</Link>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
