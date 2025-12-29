import { Head, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { toast } from 'react-toastify';

export default function Dashboard({ statistics, myStatistics, recentLetters, pendingActions, pendingLetters, userRole }) {
    const { flash } = usePage().props;

    // Show toast notification if there's a flash message
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Render dashboard based on user role
    const renderDashboard = () => {
        switch (userRole) {
            case 'Pegawai Desa':
                return <PegawaiDashboard pendingActions={pendingActions} pendingLetters={pendingLetters} myStatistics={myStatistics} />;
            case 'Sekretaris Desa':
                return <SekdesDashboard pendingActions={pendingActions} pendingLetters={pendingLetters} statistics={statistics} />;
            case 'Kepala Desa':
                return <KadesDashboard pendingActions={pendingActions} pendingLetters={pendingLetters} statistics={statistics} />;
            default:
                return <DefaultDashboard statistics={statistics} recentLetters={recentLetters} />;
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

// PBI#6: Pegawai Dashboard
function PegawaiDashboard({ pendingActions, pendingLetters, myStatistics }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Pegawai</h1>
                <p className="text-gray-600">Ringkasan surat dan aktivitas Anda</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Draft Surat"
                    value={pendingActions.drafts || 0}
                    icon="📝"
                    color="blue"
                    description="Surat yang belum dikirim"
                    link="/surat/create"
                />
                <StatCard
                    title="Menunggu Persetujuan"
                    value={pendingActions.waiting_approval || 0}
                    icon="⏳"
                    color="yellow"
                    description="Surat dalam proses review"
                />
                <StatCard
                    title="Disposisi Masuk"
                    value={pendingActions.dispositions || 0}
                    icon="📬"
                    color="green"
                    description="Surat disposisi untuk Anda"
                />
            </div>

            {/* My Letters Summary */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Surat Saya</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MiniStatCard label="Total" value={myStatistics.total} color="gray" />
                    <MiniStatCard label="Disetujui" value={myStatistics.approved} color="green" />
                    <MiniStatCard label="Ditolak" value={myStatistics.rejected} color="red" />
                    <MiniStatCard label="Dicabut" value={myStatistics.revoked} color="orange" />
                </div>
            </div>

            {/* Pending Letters Table */}
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

// PBI#7: Kades Dashboard
function KadesDashboard({ pendingActions, pendingLetters, statistics }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Kepala Desa</h1>
                <p className="text-gray-600">Surat yang memerlukan persetujuan Anda</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Perlu Persetujuan"
                    value={pendingActions.pending_approval || 0}
                    icon="✅"
                    color="red"
                    description="Surat menunggu keputusan"
                    highlight={true}
                />
                <StatCard
                    title="Disetujui Bulan Ini"
                    value={pendingActions.approved_this_month || 0}
                    icon="📋"
                    color="green"
                    description="Surat yang telah disetujui"
                />
                <StatCard
                    title="Total Bulan Ini"
                    value={pendingActions.total_this_month || 0}
                    icon="📊"
                    color="blue"
                    description="Semua surat bulan ini"
                />
            </div>

            {/* Pending Approval Letters */}
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

            {/* System Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik Sistem</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MiniStatCard label="Total Surat" value={statistics.total_letters} color="blue" />
                    <MiniStatCard label="Disetujui" value={statistics.approved} color="green" />
                    <MiniStatCard label="Ditolak" value={statistics.rejected} color="red" />
                    <MiniStatCard label="Draft" value={statistics.draft} color="gray" />
                </div>
            </div>
        </div>
    );
}

// PBI#8: Sekdes Dashboard
function SekdesDashboard({ pendingActions, pendingLetters, statistics }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Sekretaris Desa</h1>
                <p className="text-gray-600">Ringkasan statistik sistem dan surat yang perlu diverifikasi</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Perlu Verifikasi"
                    value={pendingActions.pending_review || 0}
                    icon="🔍"
                    color="yellow"
                    description="Surat menunggu review"
                    highlight={true}
                />
                <StatCard
                    title="Surat Bulan Ini"
                    value={pendingActions.total_this_month || 0}
                    icon="📊"
                    color="blue"
                    description="Total surat bulan ini"
                />
                <StatCard
                    title="Pengguna Aktif"
                    value={pendingActions.active_users || 0}
                    icon="👥"
                    color="green"
                    description="Pegawai aktif"
                />
            </div>

            {/* Pending Review Letters */}
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

            {/* System Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik Sistem</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MiniStatCard label="Total Surat" value={statistics.total_letters} color="blue" />
                    <MiniStatCard label="Terkirim" value={statistics.sent} color="yellow" />
                    <MiniStatCard label="Disetujui" value={statistics.approved} color="green" />
                    <MiniStatCard label="Ditolak" value={statistics.rejected} color="red" />
                </div>
            </div>
        </div>
    );
}

// Default Dashboard (fallback)
function DefaultDashboard({ statistics, recentLetters }) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MiniStatCard label="Total Surat" value={statistics.total_letters} color="blue" />
                <MiniStatCard label="Draft" value={statistics.draft} color="gray" />
                <MiniStatCard label="Disetujui" value={statistics.approved} color="green" />
                <MiniStatCard label="Ditolak" value={statistics.rejected} color="red" />
            </div>

            {recentLetters && recentLetters.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Surat Terbaru</h2>
                    </div>
                    <LettersTable letters={recentLetters} />
                </div>
            )}
        </div>
    );
}

// Reusable Components
function StatCard({ title, value, icon, color, description, link, highlight }) {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-green-50 border-green-200',
        yellow: 'bg-yellow-50 border-yellow-200',
        red: 'bg-red-50 border-red-200',
        orange: 'bg-orange-50 border-orange-200',
        gray: 'bg-gray-50 border-gray-200',
    };

    const iconColorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        yellow: 'text-yellow-600',
        red: 'text-red-600',
        orange: 'text-orange-600',
        gray: 'text-gray-600',
    };

    const card = (
        <div className={`${colorClasses[color]} border-2 rounded-lg p-6 ${highlight ? 'ring-2 ring-offset-2 ring-' + color + '-500' : ''} transition-all hover:shadow-md`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${iconColorClasses[color]} mb-2`}>{value}</p>
                    <p className="text-xs text-gray-500">{description}</p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );

    return link ? <Link href={link}>{card}</Link> : card;
}

function MiniStatCard({ label, value, color }) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        red: 'bg-red-100 text-red-800',
        orange: 'bg-orange-100 text-orange-800',
        gray: 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="text-center">
            <div className={`${colorClasses[color]} rounded-lg p-4`}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs font-medium mt-1">{label}</p>
            </div>
        </div>
    );
}

function LettersTable({ letters, showReviewActions, showApprovalActions }) {
    const getStatusBadge = (status) => {
        const badges = {
            'draft': { label: 'Draft', class: 'bg-gray-100 text-gray-800' },
            'sent': { label: 'Terkirim', class: 'bg-yellow-100 text-yellow-800' },
            'continued': { label: 'Diteruskan', class: 'bg-blue-100 text-blue-800' },
            'approved': { label: 'Disetujui', class: 'bg-green-100 text-green-800' },
            'rejected': { label: 'Ditolak', class: 'bg-red-100 text-red-800' },
            'revoked': { label: 'Dicabut', class: 'bg-orange-100 text-orange-800' },
        };
        const badge = badges[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}>{badge.label}</span>;
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {letter.letter_number || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {letter.subject || letter.template_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {letter.user?.name || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(letter.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(letter.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {showReviewActions && (
                                    <Link href={`/sekretaris/review/${letter.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                                        Review
                                    </Link>
                                )}
                                {showApprovalActions && (
                                    <Link href={`/kepala-desa/approval/${letter.id}`} className="text-green-600 hover:text-green-900 font-medium">
                                        Setujui
                                    </Link>
                                )}
                                {!showReviewActions && !showApprovalActions && (
                                    <Link href={`/surat/${letter.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                                        Lihat
                                    </Link>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
