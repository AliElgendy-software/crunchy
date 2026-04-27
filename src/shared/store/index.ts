import type { Order, OrderStatus, MenuItem, Branch, User } from '../types';
import { MENU_DATA } from '../../data';

// ─── Seed menu from existing data.ts ─────────────────────────────

let menuStore: MenuItem[] = [];

const buildMenu = (): MenuItem[] => {
    const items: MenuItem[] = [];
    let id = 1;
    const add = (name: string, category: MenuItem['category'], prices: Record<string, number>, description?: string) => {
        items.push({ id: String(id++), name, category, prices, available: true, description });
    };

    MENU_DATA.crepeCorner.forEach(i => add(i.name, 'crepeCorner', i.prices as Record<string, number>));
    MENU_DATA.crepeMixes.forEach(i => add(i.name, 'crepeMixes', i.prices as Record<string, number>, i.description));
    MENU_DATA.mixesCorner.forEach(i => add(i.name, 'mixesCorner', i.prices as Record<string, number>));
    MENU_DATA.chickenBurgers.forEach(i => add(i.name, 'chickenBurgers', i.prices as Record<string, number>));
    MENU_DATA.beefBurgers.forEach(i => add(i.name, 'beefBurgers', i.prices as Record<string, number>));
    MENU_DATA.negresco.forEach(i => add(i.name, 'negresco', i.prices as Record<string, number>));
    MENU_DATA.pizza.forEach(i => add(i.name, 'pizza', i.prices as Record<string, number>));

    return items;
};

// ─── Seed orders (realistic demo data) ───────────────────────────

const now = Date.now();
const SEED_ORDERS: Order[] = [
    {
        id: 'ord-001', trackingCode: 'CRN-1001',
        customerName: 'أحمد محمد', customerPhone: '01012345678', customerAddress: 'العزيزية - شارع الجمهورية',
        items: [
            { id: 'كريب الحريف-كبير', name: 'كريب الحريف', price: 85, size: 'كبير', quantity: 2, menuItemId: '1' },
            { id: 'تشيكن كلاسيك-Single', name: 'تشيكن كلاسيك', price: 80, size: 'Single', quantity: 1, menuItemId: '14' },
        ],
        total: 250, status: 'preparing',
        createdAt: now - 12 * 60 * 1000, updatedAt: now - 10 * 60 * 1000, branchId: 'branch-1',
    },
    {
        id: 'ord-002', trackingCode: 'CRN-1002',
        customerName: 'سارة علي', customerPhone: '01198765432', customerAddress: 'الحي الثالث - بلوك 5',
        items: [
            { id: 'مارجريتا-M', name: 'مارجريتا', price: 99, size: 'M', quantity: 1, menuItemId: '29' },
            { id: 'كوكتيل فراخ-M', name: 'كوكتيل فراخ', price: 65, size: 'M', quantity: 1, menuItemId: '11' },
        ],
        total: 164, status: 'pending',
        createdAt: now - 5 * 60 * 1000, updatedAt: now - 5 * 60 * 1000, branchId: 'branch-1',
    },
    {
        id: 'ord-003', trackingCode: 'CRN-1003',
        customerName: 'محمود خالد', customerPhone: '01555111222', customerAddress: 'القرية الذكية - فيلا 12',
        items: [
            { id: 'اسماش برجر-Double', name: 'اسماش برجر', price: 109, size: 'Double', quantity: 3, menuItemId: '20' },
        ],
        total: 327, status: 'ready',
        createdAt: now - 25 * 60 * 1000, updatedAt: now - 8 * 60 * 1000, branchId: 'branch-1',
    },
    {
        id: 'ord-004', trackingCode: 'CRN-1000',
        customerName: 'فاطمة إبراهيم', customerPhone: '01099887766', customerAddress: 'المدينة الجديدة - برج 3',
        items: [
            { id: 'شيش طاووق-L', name: 'شيش طاووق', price: 80, size: 'L', quantity: 2, menuItemId: '3' },
        ],
        total: 160, status: 'delivered',
        createdAt: now - 60 * 60 * 1000, updatedAt: now - 45 * 60 * 1000, branchId: 'branch-1',
    },
];

// ─── Store State ──────────────────────────────────────────────────

type Listener = () => void;

class Store {
    private orders: Order[] = [...SEED_ORDERS];
    private menu: MenuItem[] = buildMenu();
    private branch: Branch = {
        id: 'branch-1', name: 'Crunchy العزيزية',
        address: 'العزيزية - أمام الكوبري الجديد',
        phone: '01118280661', whatsapp: '201118280661',
    };
    private listeners: Set<Listener> = new Set();

    subscribe(fn: Listener) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    private notify() {
        this.listeners.forEach(fn => fn());
    }

    // ── Orders ──────────────────────
    getOrders(): Order[] { return [...this.orders].sort((a, b) => b.createdAt - a.createdAt); }
    getOrder(id: string): Order | undefined { return this.orders.find(o => o.id === id || o.trackingCode === id); }

    addOrder(order: Omit<Order, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt' | 'branchId'>): Order {
        const count = this.orders.length + 1000;
        const newOrder: Order = {
            ...order,
            id: `ord-${Date.now()}`,
            trackingCode: `CRN-${count}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            branchId: 'branch-1',
        };
        this.orders = [newOrder, ...this.orders];
        this.notify();
        return newOrder;
    }

    updateOrderStatus(id: string, status: OrderStatus) {
        this.orders = this.orders.map(o =>
            o.id === id ? { ...o, status, updatedAt: Date.now() } : o
        );
        this.notify();
    }

    // ── Menu ────────────────────────
    getMenu(): MenuItem[] { return [...this.menu]; }

    updateMenuItem(id: string, updates: Partial<MenuItem>) {
        this.menu = this.menu.map(m => m.id === id ? { ...m, ...updates } : m);
        this.notify();
    }

    toggleItemAvailability(id: string) {
        this.menu = this.menu.map(m => m.id === id ? { ...m, available: !m.available } : m);
        this.notify();
    }

    // ── Analytics ───────────────────
    getTodayRevenue(): number {
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        return this.orders.filter(o => o.createdAt >= todayStart.getTime() && o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total, 0);
    }

    getWeeklyStats(): { date: string; revenue: number; orderCount: number }[] {
        const stats: { date: string; revenue: number; orderCount: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
            const next = new Date(d); next.setDate(next.getDate() + 1);
            const dayOrders = this.orders.filter(o => o.createdAt >= d.getTime() && o.createdAt < next.getTime() && o.status !== 'cancelled');
            stats.push({
                date: d.toLocaleDateString('ar-EG', { weekday: 'short' }),
                revenue: dayOrders.reduce((s, o) => s + o.total, 0),
                orderCount: dayOrders.length,
            });
        }
        return stats;
    }

    getPopularItems(): { name: string; count: number; revenue: number }[] {
        const map = new Map<string, { count: number; revenue: number }>();
        this.orders.filter(o => o.status !== 'cancelled').forEach(o => {
            o.items.forEach(item => {
                const prev = map.get(item.name) || { count: 0, revenue: 0 };
                map.set(item.name, { count: prev.count + item.quantity, revenue: prev.revenue + item.price * item.quantity });
            });
        });
        return [...map.entries()]
            .map(([name, v]) => ({ name, ...v }))
            .sort((a, b) => b.count - a.count).slice(0, 8);
    }

    getOrdersByStatus(): Record<OrderStatus, number> {
        const counts: Record<OrderStatus, number> = { pending: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0 };
        this.orders.forEach(o => counts[o.status]++);
        return counts;
    }

    // ── Branch ──────────────────────
    getBranch(): Branch { return { ...this.branch }; }
    updateBranch(updates: Partial<Branch>) { this.branch = { ...this.branch, ...updates }; this.notify(); }
}

export const store = new Store();
