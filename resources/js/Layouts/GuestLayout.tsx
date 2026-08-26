import { PropsWithChildren } from 'react';
import '@/../css/login.css';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="login-screen">
            {/* ===== LEFT: Full-bleed brand panel ===== */}
            <div className="brand-side">
                <div className="bs-blob x1"></div>
                <div className="bs-blob x2"></div>
                <div className="bs-blob x3"></div>

                <div className="bs-top">
                    <div className="mark">
                        <i className="bi bi-patch-check-fill"></i>
                    </div>
                    SerGen
                </div>

                <div className="bs-mid">
                    <div className="eyebrow">
                        <i className="bi bi-stars"></i> Generator Sertifikat Digital
                    </div>
                    <h1>Terbitkan sertifikat rapi, tanpa desain ulang setiap saat.</h1>
                    <p>
                        Pakai desain Canva favoritmu, atur posisi nama dan tanda tangan sekali, lalu generate untuk seluruh peserta dalam hitungan menit.
                    </p>

                    <div className="feat-list">
                        <div className="feat-row">
                            <div className="fi">
                                <i className="bi bi-magic"></i>
                            </div>
                            <div>
                                <div className="ft">Generate massal dari Excel</div>
                                <div className="fs">Ratusan sertifikat sekaligus lewat antrian background</div>
                            </div>
                        </div>
                        <div className="feat-row">
                            <div className="fi">
                                <i className="bi bi-qr-code-scan"></i>
                            </div>
                            <div>
                                <div className="ft">Verifikasi publik via QR</div>
                                <div className="fs">Setiap sertifikat bisa dicek keasliannya secara instan</div>
                            </div>
                        </div>
                        <div className="feat-row">
                            <div className="fi">
                                <i className="bi bi-shield-lock"></i>
                            </div>
                            <div>
                                <div className="ft">Kontrol akses berlapis</div>
                                <div className="fs">Role &amp; permission granular untuk tiap anggota tim</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bs-bottom">
                    <div className="bs-stat">
                        <div className="sv">2.480+</div>
                        <div className="sl">Sertifikat Terbit</div>
                    </div>
                    <div className="bs-stat">
                        <div className="sv">18</div>
                        <div className="sl">Template Aktif</div>
                    </div>
                    <div className="bs-stat">
                        <div className="sv">24</div>
                        <div className="sl">Pengguna Aktif</div>
                    </div>
                </div>
            </div>

            {/* ===== RIGHT: Form container ===== */}
            <div className="form-side">
                <div className="form-inner">
                    <div className="mobile-brand">
                        <div className="mark">
                            <i className="bi bi-patch-check-fill"></i>
                        </div>
                        SerGen
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
