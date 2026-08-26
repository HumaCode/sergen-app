import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import '@/../css/dashboard.css';

export default function Dashboard() {
    const user = usePage<PageProps>().props.auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard — SerGen" />

            <div className="page-head">
                <div>
                    <h1>Selamat datang kembali, {user.name} 👋</h1>
                    <p>Berikut ringkasan aktivitas sertifikat kamu hari ini.</p>
                </div>
                <button className="btn-primary" type="button">
                    <i className="bi bi-plus-lg"></i> Buat Sertifikat Baru
                </button>
            </div>

            {/* Stats */}
            <div className="stat-grid">
                <div className="stat-card teal">
                    <div className="icon-box">
                        <i className="bi bi-award"></i>
                    </div>
                    <div className="value">2.480</div>
                    <div className="label">Sertifikat Terbit</div>
                    <div className="trend up">
                        <i className="bi bi-arrow-up-short"></i> 12% dari bulan lalu
                    </div>
                </div>

                <div className="stat-card coral">
                    <div className="icon-box">
                        <i className="bi bi-file-earmark-image"></i>
                    </div>
                    <div className="value">18</div>
                    <div className="label">Template Aktif</div>
                    <div className="trend up">
                        <i className="bi bi-arrow-up-short"></i> 2 template baru
                    </div>
                </div>

                <div className="stat-card sun">
                    <div className="icon-box">
                        <i className="bi bi-layers"></i>
                    </div>
                    <div className="value">3</div>
                    <div className="label">Batch Diproses</div>
                    <div className="trend down">
                        <i className="bi bi-clock-history"></i> Sedang berjalan
                    </div>
                </div>

                <div className="stat-card sky">
                    <div className="icon-box">
                        <i className="bi bi-people"></i>
                    </div>
                    <div className="value">6.120</div>
                    <div className="label">Total Peserta</div>
                    <div className="trend up">
                        <i className="bi bi-arrow-up-short"></i> 340 peserta baru
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="quick-grid">
                <button className="quick-card" type="button">
                    <div
                        className="qi"
                        style={{
                            background: 'var(--teal-soft)',
                            color: 'var(--teal-deep)',
                        }}
                    >
                        <i className="bi bi-upload"></i>
                    </div>
                    <div className="qtitle">Upload Template</div>
                    <div className="qsub">Impor desain dari Canva</div>
                </button>

                <button className="quick-card" type="button">
                    <div
                        className="qi"
                        style={{
                            background: 'var(--coral-soft)',
                            color: 'var(--coral)',
                        }}
                    >
                        <i className="bi bi-file-earmark-spreadsheet"></i>
                    </div>
                    <div className="qtitle">Import Peserta</div>
                    <div className="qsub">Unggah data via Excel</div>
                </button>

                <button className="quick-card" type="button">
                    <div
                        className="qi"
                        style={{
                            background: 'var(--sun-soft)',
                            color: '#C98A2E',
                        }}
                    >
                        <i className="bi bi-lightning-charge"></i>
                    </div>
                    <div className="qtitle">Generate Batch</div>
                    <div className="qsub">Proses sertifikat massal</div>
                </button>

                <button className="quick-card" type="button">
                    <div
                        className="qi"
                        style={{
                            background: '#E8EEFB',
                            color: '#4C6EF5',
                        }}
                    >
                        <i className="bi bi-qr-code"></i>
                    </div>
                    <div className="qtitle">Cek Verifikasi</div>
                    <div className="qsub">Lihat status sertifikat</div>
                </button>
            </div>

            {/* Table + Activity */}
            <div className="grid-2">
                <div className="panel">
                    <div className="panel-head">
                        <h3>Batch Terbaru</h3>
                        <a href="#">Lihat semua</a>
                    </div>
                    <table className="tbl">
                        <thead>
                            <tr>
                                <th>Batch</th>
                                <th>Template</th>
                                <th>Peserta</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="row-title">
                                    <span className="tpl-thumb">
                                        <i className="bi bi-mortarboard"></i>
                                    </span>
                                    <div>
                                        <div className="rt-name">
                                            Pelatihan Digital Kominfo
                                        </div>
                                        <div className="rt-sub">21 Agu 2026</div>
                                    </div>
                                </td>
                                <td>Template Formal Biru</td>
                                <td>248</td>
                                <td>
                                    <span className="pill done">
                                        <i className="bi bi-check-circle-fill"></i>{' '}
                                        Selesai
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="row-title">
                                    <span className="tpl-thumb">
                                        <i className="bi bi-briefcase"></i>
                                    </span>
                                    <div>
                                        <div className="rt-name">
                                            Workshop UMKM Batik
                                        </div>
                                        <div className="rt-sub">20 Agu 2026</div>
                                    </div>
                                </td>
                                <td>Template Sun Gradient</td>
                                <td>132</td>
                                <td>
                                    <span className="pill process">
                                        <i className="bi bi-arrow-repeat"></i>{' '}
                                        Diproses
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="row-title">
                                    <span className="tpl-thumb">
                                        <i className="bi bi-globe"></i>
                                    </span>
                                    <div>
                                        <div className="rt-name">Webinar SPBE 2026</div>
                                        <div className="rt-sub">18 Agu 2026</div>
                                    </div>
                                </td>
                                <td>Template Minimal Teal</td>
                                <td>96</td>
                                <td>
                                    <span className="pill done">
                                        <i className="bi bi-check-circle-fill"></i>{' '}
                                        Selesai
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="row-title">
                                    <span className="tpl-thumb">
                                        <i className="bi bi-shield-exclamation"></i>
                                    </span>
                                    <div>
                                        <div className="rt-name">
                                            Sertifikasi Keamanan Data
                                        </div>
                                        <div className="rt-sub">15 Agu 2026</div>
                                    </div>
                                </td>
                                <td>Template Formal Biru</td>
                                <td>54</td>
                                <td>
                                    <span className="pill failed">
                                        <i className="bi bi-exclamation-circle-fill"></i>{' '}
                                        Gagal
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="panel">
                    <div className="panel-head">
                        <h3>Aktivitas Terbaru</h3>
                    </div>
                    <div className="activity">
                        <div
                            className="dot"
                            style={{
                                background: 'var(--teal-soft)',
                                color: 'var(--teal-deep)',
                            }}
                        >
                            <i className="bi bi-check2"></i>
                        </div>
                        <div>
                            <div className="txt">
                                <b>Batch "Pelatihan Digital Kominfo"</b> selesai
                                digenerate
                            </div>
                            <div className="time">10 menit lalu</div>
                        </div>
                    </div>

                    <div className="activity">
                        <div
                            className="dot"
                            style={{
                                background: 'var(--sun-soft)',
                                color: '#C98A2E',
                            }}
                        >
                            <i className="bi bi-upload"></i>
                        </div>
                        <div>
                            <div className="txt">
                                <b>Template baru</b> "Sun Gradient" diunggah
                            </div>
                            <div className="time">2 jam lalu</div>
                        </div>
                    </div>

                    <div className="activity">
                        <div
                            className="dot"
                            style={{
                                background: '#E8EEFB',
                                color: '#4C6EF5',
                            }}
                        >
                            <i className="bi bi-people"></i>
                        </div>
                        <div>
                            <div className="txt">
                                <b>340 peserta</b> berhasil diimpor dari Excel
                            </div>
                            <div className="time">Kemarin, 16:20</div>
                        </div>
                    </div>

                    <div className="activity">
                        <div
                            className="dot"
                            style={{
                                background: 'var(--coral-soft)',
                                color: 'var(--coral)',
                            }}
                        >
                            <i className="bi bi-exclamation-triangle"></i>
                        </div>
                        <div>
                            <div className="txt">
                                Batch <b>"Sertifikasi Keamanan Data"</b> gagal, 3 file
                                error font
                            </div>
                            <div className="time">3 hari lalu</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
