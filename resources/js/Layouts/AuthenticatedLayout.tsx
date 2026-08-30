import { LogoutModal } from '@/Components/LogoutModal';
import { useLayoutState } from '@/assets/global';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import '@/../css/global.css';

export default function AuthenticatedLayout({
    header,
    defaultSidebarCollapsed = false,
    children,
}: PropsWithChildren<{ header?: ReactNode; defaultSidebarCollapsed?: boolean }>) {
    const pageProps = usePage<PageProps>().props;
    const user = pageProps.auth.user;
    const menus = pageProps.menus || {};

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const {
        sidebarCollapsed,
        mobileOpen,
        userDropdownOpen,
        toggleSidebar,
        closeMobileSidebar,
        toggleUserDropdown,
    } = useLayoutState(defaultSidebarCollapsed);

    const handleConfirmLogout = () => {
        router.post(route('logout'), {}, {
            onStart: () => setIsLoggingOut(true),
            onFinish: () => {
                setIsLoggingOut(false);
                setShowLogoutModal(false);
            },
        });
    };

    // Generate two initials for avatar e.g. "fLINK" -> "FL"
    const getInitials = (name: string) => {
        if (!name) return 'US';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Helper to check active route matching menu url
    const isMenuActive = (url: string) => {
        if (!url) return false;
        const currentPath = window.location.pathname;
        if (url === '/dashboard' || url === 'dashboard') {
            return route().current('dashboard');
        }
        return currentPath.includes(url);
    };

    return (
        <div>
            {/* Logout Modal Component */}
            <LogoutModal
                show={showLogoutModal}
                isLoading={isLoggingOut}
                onClose={() => !isLoggingOut && setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />

            {/* Ambient background */}
            <div className="ambient">
                <div className="blob a1"></div>
                <div className="blob a2"></div>
            </div>

            {/* Mobile overlay */}
            <div
                className={`overlay ${mobileOpen ? 'show' : ''}`}
                onClick={closeMobileSidebar}
            ></div>

            {/* ============ SIDEBAR ============ */}
            <aside
                className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${
                    mobileOpen ? 'mobile-open' : ''
                }`}
            >
                <div className="side-brand">
                    <div className="mark">
                        <i className="bi bi-patch-check-fill"></i>
                    </div>
                    <span className="name">SerGen</span>
                </div>

                <div className="side-scroll">
                    {Object.keys(menus).length > 0 ? (
                        Object.entries(menus).map(([category, items]) => (
                            <div key={category}>
                                <div className="nav-category">
                                    <span>{category}</span>
                                </div>
                                {items.map((menu) => (
                                    <Link
                                        key={menu.id || menu.name}
                                        className={`nav-item ${
                                            isMenuActive(menu.url) ? 'active' : ''
                                        }`}
                                        href={menu.url ? (menu.url.startsWith('/') ? menu.url : `/${menu.url}`) : '#'}
                                    >
                                        <i className={`bi ${menu.icon || 'bi-circle'} ic`}></i>
                                        <span className="label">{menu.name}</span>
                                    </Link>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div>
                            <div className="nav-category">
                                <span>Utama</span>
                            </div>
                            <Link
                                className={`nav-item ${route().current('dashboard') ? 'active' : ''}`}
                                href={route('dashboard')}
                            >
                                <i className="bi bi-grid-1x2-fill ic"></i>
                                <span className="label">Dashboard</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="side-foot">
                    <span>SerGen v1.0</span>
                </div>
            </aside>

            {/* ============ MAIN SHELL ============ */}
            <div className={`main ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="btn-icon"
                            onClick={toggleSidebar}
                            type="button"
                        >
                            <i className="bi bi-list"></i>
                        </button>
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Cari template, batch, atau peserta..."
                            />
                        </div>
                    </div>

                    <div className="topbar-right">
                        <button className="btn-icon notif-dot" type="button">
                            <i className="bi bi-bell"></i>
                        </button>

                        <div style={{ position: 'relative' }}>
                            <div
                                className={`user-trigger ${userDropdownOpen ? 'open' : ''}`}
                                onClick={toggleUserDropdown}
                            >
                                <div className="avatar">{getInitials(user.name)}</div>
                                <div className="user-meta">
                                    <div className="uname">{user.name}</div>
                                    <div className="urole">Administrator</div>
                                </div>
                                <i className="bi bi-chevron-down chev"></i>
                            </div>

                            <div
                                className={`dropdown ${userDropdownOpen ? 'show' : ''}`}
                            >
                                <div className="dd-head">
                                    <div className="avatar">{getInitials(user.name)}</div>
                                    <div>
                                        <div className="uname">{user.name}</div>
                                        <div className="uemail">{user.email}</div>
                                        <span className="dd-role-badge">
                                            Administrator
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    className="dd-item"
                                    href={route('profile.edit')}
                                >
                                    <i className="bi bi-person-circle"></i> Profil Saya
                                </Link>
                                <a className="dd-item" href="#">
                                    <i className="bi bi-gear"></i> Pengaturan Akun
                                </a>
                                <a className="dd-item" href="#">
                                    <i className="bi bi-life-preserver"></i> Bantuan
                                </a>
                                <div className="dd-sep"></div>
                                <button
                                    className="dd-item danger"
                                    type="button"
                                    onClick={() => setShowLogoutModal(true)}
                                >
                                    <i className="bi bi-box-arrow-right"></i> Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="content">{children}</main>

                {/* Footer */}
                <footer className="footer">
                    <div>© 2026 SerGen — Generator Sertifikat Digital</div>
                    <div>
                        <a href="#">Bantuan</a>
                        <a href="#">Dokumentasi</a>
                        <a href="#">Privasi</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
