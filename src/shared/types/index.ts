// ─── User & Auth ─────────────────────────────────────────────────
export type Role = 'customer' | 'staff' | 'manager' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    branchId: string;
}

// ─── Menu ─────────────────────────────────────────────────────────
export interface MenuItem {
    id: string;
    name: string;
    category: MenuCategory;
    description?: string;
    prices: Record<string, number>;
    available: boolean;
    popular?: boolean;
}

export type MenuCategory =
    | 'crepeCorner'
    | 'crepeMixes'
    | 'mixesCorner'
    | 'chickenBurgers'
    | 'beefBurgers'
    | 'negresco'
    | 'pizza'
    | 'extras';

// ─── Orders ───────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    menuItemId: string;
}

export interface Order {
    id: string;
    trackingCode: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    createdAt: number; // timestamp ms
    updatedAt: number;
    branchId: string;
    notes?: string;
}

// ─── Analytics ────────────────────────────────────────────────────
export interface DailyStat {
    date: string; // YYYY-MM-DD
    revenue: number;
    orderCount: number;
}

export interface PopularItem {
    name: string;
    count: number;
    revenue: number;
}

// ─── Branch ───────────────────────────────────────────────────────
export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    whatsapp: string;
}
