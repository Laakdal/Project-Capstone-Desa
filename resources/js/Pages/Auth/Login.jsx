import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import './Login.css';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login - Arsip Desa" />
            <div className="login-container">
                {/* Left Panel - Branding */}
                <div className="login-left-panel">
                    <div className="branding-content">
                        {/* Logo and Title */}
                        <div className="logo-section">
                            <div className="logo-icon">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="40" height="40" rx="8" fill="white"/>
                                    <path d="M20 10L12 16V28H16V22H24V28H28V16L20 10Z" fill="#2563EB"/>
                                </svg>
                            </div>
                            <div className="logo-text">
                                <h1>Arsip Desa</h1>
                                <p>Digital Archive System</p>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h2 className="main-heading">
                            Sistem Manajemen Arsip<br />
                            Surat Desa
                        </h2>

                        {/* Description */}
                        <p className="description">
                            Platform digital untuk mengelola, menyimpan, dan 
                            mengakses arsip surat desa dengan aman dan efisien.
                        </p>

                        {/* Features */}
                        <div className="features-list">
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className="feature-text">
                                    <h3>Keamanan Terjamin</h3>
                                    <p>Data arsip tersimpan dengan enkripsi tingkat tinggi</p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className="feature-text">
                                    <h3>Pencarian Cepat</h3>
                                    <p>Temukan dokumen dalam hitungan detik</p>
                                </div>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="white"/>
                                    </svg>
                                </div>
                                <div className="feature-text">
                                    <h3>Riwayat Lengkap</h3>
                                    <p>Lacak semua aktivitas dan perubahan dokumen</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="left-footer">
                            © 2024 Arsip Desa. Sistem Informasi Pemerintah Desa
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="login-right-panel">
                    <div className="login-form-container">
                        {/* Welcome Message */}
                        <div className="welcome-section">
                            <h2>Selamat Datang Kembali</h2>
                            <p>Silakan masuk dengan akun pegawai internal Anda untuk mengakses sistem arsip</p>
                        </div>

                        {status && (
                            <div className="status-message">
                                {status}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="login-form">
                            {/* Email/NIP Input */}
                            <div className="form-group">
                                <label htmlFor="email">NIP / Username</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10ZM10 12.5C6.66667 12.5 0 14.175 0 17.5V20H20V17.5C20 14.175 13.3333 12.5 10 12.5Z" fill="#9CA3AF"/>
                                    </svg>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Masukkan NIP atau username"
                                        autoFocus
                                        required
                                    />
                                </div>
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            {/* Password Input */}
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.8333 9.16667H15V6.66667C15 3.90833 12.7583 1.66667 10 1.66667C7.24167 1.66667 5 3.90833 5 6.66667V9.16667H4.16667C3.25 9.16667 2.5 9.91667 2.5 10.8333V16.6667C2.5 17.5833 3.25 18.3333 4.16667 18.3333H15.8333C16.75 18.3333 17.5 17.5833 17.5 16.6667V10.8333C17.5 9.91667 16.75 9.16667 15.8333 9.16667ZM10 14.1667C9.08333 14.1667 8.33333 13.4167 8.33333 12.5C8.33333 11.5833 9.08333 10.8333 10 10.8333C10.9167 10.8333 11.6667 11.5833 11.6667 12.5C11.6667 13.4167 10.9167 14.1667 10 14.1667ZM12.5833 9.16667H7.41667V6.66667C7.41667 5.24167 8.575 4.08333 10 4.08333C11.425 4.08333 12.5833 5.24167 12.5833 6.66667V9.16667Z" fill="#9CA3AF"/>
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 4.16667C5.83333 4.16667 2.27499 6.73333 0.833325 10.4167C2.27499 14.1 5.83333 16.6667 10 16.6667C14.1667 16.6667 17.725 14.1 19.1667 10.4167C17.725 6.73333 14.1667 4.16667 10 4.16667ZM10 14.5833C7.69999 14.5833 5.83333 12.7167 5.83333 10.4167C5.83333 8.11667 7.69999 6.25 10 6.25C12.3 6.25 14.1667 8.11667 14.1667 10.4167C14.1667 12.7167 12.3 14.5833 10 14.5833ZM10 7.91667C8.61666 7.91667 7.49999 9.03333 7.49999 10.4167C7.49999 11.8 8.61666 12.9167 10 12.9167C11.3833 12.9167 12.5 11.8 12.5 10.4167C12.5 9.03333 11.3833 7.91667 10 7.91667Z" fill="#9CA3AF"/>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 6.25C12.3 6.25 14.1667 8.11667 14.1667 10.4167C14.1667 11.0833 14.0083 11.7083 13.7333 12.2667L16.1 14.6333C17.4833 13.5 18.5833 12.05 19.1667 10.4167C17.725 6.73333 14.1667 4.16667 10 4.16667C8.93333 4.16667 7.90833 4.34167 6.95 4.65833L8.73333 6.44167C9.29166 6.16667 9.91666 6.00833 10.6 6.00833M1.66666 2.625L3.725 4.68333L4.16666 5.125C2.66666 6.25833 1.46666 7.76667 0.833325 10.4167C2.27499 14.1 5.83333 16.6667 10 16.6667C11.175 16.6667 12.3 16.4583 13.3417 16.0833L13.75 16.4917L16.375 19.125L17.5 18L2.79166 3.29167M5.83333 7.79167L7.14166 9.1C7.1 9.2 7.08333 9.30833 7.08333 9.41667C7.08333 10.8 8.2 11.9167 9.58333 11.9167C9.69166 11.9167 9.8 11.9 9.9 11.8583L11.2083 13.1667C10.8417 13.3333 10.4333 13.4167 10 13.4167C7.69999 13.4167 5.83333 11.55 5.83333 9.25C5.83333 8.81667 5.91666 8.40833 6.08333 8.04167" fill="#9CA3AF"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="form-options">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span>Ingat saya</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="forgot-password">
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="submit-button" disabled={processing}>
                                {processing ? 'Memproses...' : 'Masuk ke Sistem'} 
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 0L8.59 1.41L15.17 8H0V10H15.17L8.59 16.59L10 18L20 8L10 0Z" fill="white"/>
                                </svg>
                            </button>
                        </form>

                        {/* Help Section */}
                        <div className="help-section">
                            <div className="help-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="#2563EB"/>
                                </svg>
                            </div>
                            <div className="help-text">
                                <strong>Butuh Bantuan?</strong>
                                <p>Hubungi admin IT desa untuk bantuan akses atau reset password</p>
                                <div className="contact-methods">
                                    <a href="tel:+62" className="contact-link">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.2 7.2C4.56 9.9 6.76667 12.1067 9.46667 13.4667L11.6 11.3333C11.8667 11.0667 12.2667 10.9733 12.6 11.0933C13.7333 11.4667 14.9733 11.6667 16.2667 11.6667C16.68 11.6667 17 11.9867 17 12.4V15.6C17 16.0133 16.68 16.3333 16.2667 16.3333C7.26 16.3333 0 9.07333 0 0.0666667C0 -0.346667 0.32 -0.666667 0.733333 -0.666667H4C4.41333 -0.666667 4.73333 -0.346667 4.73333 0.0666667C4.73333 1.36667 4.93333 2.6 5.30667 3.73333C5.42667 4.06667 5.34 4.46 5.06667 4.73333L3.2 7.2Z" fill="#2563EB" transform="translate(-1 0)"/>
                                        </svg>
                                        Telepon
                                    </a>
                                    <a href="mailto:admin@desa.go.id" className="contact-link">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.4 2.66667H1.6C0.72 2.66667 0.00799999 3.38667 0.00799999 4.26667L0 12.2667C0 13.1467 0.72 13.8667 1.6 13.8667H14.4C15.28 13.8667 16 13.1467 16 12.2667V4.26667C16 3.38667 15.28 2.66667 14.4 2.66667ZM14.4 6.13333L8 9.86667L1.6 6.13333V4.53333L8 8.26667L14.4 4.53333V6.13333Z" fill="#2563EB"/>
                                        </svg>
                                        Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
