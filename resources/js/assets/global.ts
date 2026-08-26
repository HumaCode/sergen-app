import { useState, useEffect } from 'react';

export function useLayoutState() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth <= 991) {
            setMobileOpen((prev) => !prev);
        } else {
            setSidebarCollapsed((prev) => !prev);
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
