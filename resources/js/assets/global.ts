import { useState, useEffect } from 'react';

export function useLayoutState(defaultCollapsed: boolean = false) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sergen_sidebar_collapsed');
            if (saved !== null) {
                return JSON.parse(saved);
            }
        }
        return defaultCollapsed;
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth <= 991) {
            setMobileOpen((prev) => !prev);
        } else {
            setSidebarCollapsed((prev) => {
                const next = !prev;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('sergen_sidebar_collapsed', JSON.stringify(next));
                }
                return next;
            });
        }
    };

    const closeMobileSidebar = () => {
        setMobileOpen(false);
    };

    const toggleUserDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUserDropdownOpen((prev) => !prev);
    };

    const closeUserDropdown = () => {
        setUserDropdownOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 991) {
                setMobileOpen(false);
            }
        };

        const handleClickOutside = () => {
            setUserDropdownOpen(false);
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return {
        sidebarCollapsed,
        mobileOpen,
        userDropdownOpen,
        toggleSidebar,
        closeMobileSidebar,
        toggleUserDropdown,
        closeUserDropdown,
    };
}
