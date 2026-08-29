import { FormButton } from '@/Components/FormButton';
import { FormCheckbox } from '@/Components/FormCheckbox';
import { FormInput } from '@/Components/FormInput';
import { FullScreenLoader } from '@/Components/FullScreenLoader';
import GuestLayout from '@/Layouts/GuestLayout';
import { useLoginToggle } from '@/assets/login';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const { data, setData, post, processing, errors, setError, reset, clearErrors } = useForm({
        username: '',
        password: '',
        remember: false as boolean,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [userName, setUserName] = useState('');
    const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
    const { showPassword, togglePasswordVisibility } = useLoginToggle();

    // Extract initial seconds when error arrives
    useEffect(() => {
        const errorMsg = errors.username || errors.password;
        if (typeof errorMsg === 'string') {
            const match = errorMsg.match(/(\d+)\s*detik/i);
            if (match && match[1]) {
                const sec = parseInt(match[1], 10);
                setCountdownSeconds(sec);
            }
        }
    }, [errors.username, errors.password]);

    // Live 1-second interval countdown timer
    useEffect(() => {
        if (countdownSeconds === null || countdownSeconds <= 0) return;

        const timer = setInterval(() => {
            setCountdownSeconds((prev) => {
                if (prev === null || prev <= 1) {
                    clearErrors();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdownSeconds !== null]);

    // Format seconds into MM:SS (e.g. 293 => "04:53")
    const formatTime = (seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        const mm = String(m).padStart(2, '0');
        const ss = String(s).padStart(2, '0');
        return `${mm}:${ss}`;
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        if (countdownSeconds !== null && countdownSeconds > 0) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(route('login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const resData = await response.json();
                setUserName(resData.user?.name || 'Dev');
                setIsSubmitting(false);
                setIsSuccess(true);

                // Delay 1.5s to let the user see the bounce checkmark and "Selamat datang, [Name]"
                await new Promise((resolve) => setTimeout(resolve, 1500));
                router.visit(resData.redirect || route('dashboard'));
            } else if (response.status === 422) {
                const errData = await response.json();
                if (errData.errors) {
                    setError(errData.errors);
                }
                setIsSubmitting(false);
            } else {
                setIsSubmitting(false);
            }
        } catch {
            setIsSubmitting(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Masuk — SerGen" />

            <FullScreenLoader
                show={isSubmitting || isSuccess}
                isSuccess={isSuccess}
                title="Proses Login..."
                subtitle="Mohon tunggu sebentar..!"
                userName={userName || data.username}
            />

            <div className="form-head">
                <span className="eyebrow">Selamat datang kembali</span>
                <h2>Masuk ke akun kamu</h2>
                <p>Kelola template dan terbitkan sertifikat dari sini.</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {(errors.username || errors.password) && (
                <div className="error-banner">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <div>
                        <strong>Gagal Masuk!</strong>
                        {countdownSeconds !== null && countdownSeconds > 0 ? (
                            <div>
                                Terlalu banyak percobaan login. Silakan coba lagi dalam{' '}
                                <span className="countdown-badge">{formatTime(countdownSeconds)}</span>
                            </div>
                        ) : (
                            <div>{errors.username || errors.password}</div>
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={submit}>
                <FormInput
                    id="username"
                    type="text"
                    label="Username"
                    icon="bi-person"
                    placeholder="Masukkan username"
                    autoComplete="username"
                    value={data.username}
                    onChange={(e) => setData('username', e.target.value)}
                    error={errors.username}
                    disabled={isSubmitting || isSuccess || (countdownSeconds !== null && countdownSeconds > 0)}
                    required
                />

                <FormInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Kata sandi"
                    icon="bi-lock"
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    disabled={isSubmitting || isSuccess || (countdownSeconds !== null && countdownSeconds > 0)}
                    rightElement={
                        <i
                            className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} toggle-pass`}
                            onClick={togglePasswordVisibility}
                        ></i>
                    }
                    required
                />

                <div className="row-between">
                    <FormCheckbox
                        id="remember"
                        label="Ingat saya"
                        checked={data.remember}
                        disabled={isSubmitting || isSuccess || (countdownSeconds !== null && countdownSeconds > 0)}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    {canResetPassword && (
                        <Link href={route('password.request')}>
                            Lupa kata sandi?
                        </Link>
                    )}
                </div>

                <FormButton
                    type="submit"
                    icon="bi-arrow-right"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || isSuccess || (countdownSeconds !== null && countdownSeconds > 0)}
                >
                    Masuk
                </FormButton>
            </form>

            <div className="divider">atau lanjutkan dengan</div>

            <div className="sso-row">
                <FormButton type="button" variant="sso">
                    <i className="bi bi-google"></i> Google
                </FormButton>
                <FormButton type="button" variant="sso">
                    <i className="bi bi-microsoft"></i> Microsoft
                </FormButton>
            </div>

            <div className="signup-note">
                Belum punya akun? <Link href={route('register')}>Daftar sekarang</Link>
            </div>

            <div className="form-foot">© 2026 SerGen — Generator Sertifikat Digital</div>
        </GuestLayout>
    );
}
