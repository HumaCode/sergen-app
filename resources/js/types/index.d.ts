export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface MenuItem {
    id: string;
    name: string;
    url: string;
    category: string;
    icon: string;
    is_active: boolean;
    orders: number;
}

export type GroupedMenus = Record<string, MenuItem[]>;

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    menus?: GroupedMenus;
};
