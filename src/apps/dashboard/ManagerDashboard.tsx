import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard, ClipboardList, BarChart3, Settings, LogOut, Bell,
    TrendingUp, ShoppingBag, Users, Clock, ChevronRight, Search,
    Filter, MoreVertical, CheckCircle, Loader2, Package, AlertCircle, Truck,
    ArrowUpRight, Utensils, Star, RefreshCw, Download, Menu, X
} from 'lucide-react';
import { useOrders, useAnalytics, useBranch } from '../../shared/hooks/useStore';
import { useAuth } from '../../shared/hooks/useAuth';
import { cn } from '../../lib/utils';
import type { Order, OrderStatus } from '../../shared/types';

// ─── Status helpers ───────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending: { label: 'انتظار', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: <Clock className="w-3 h-3" /> },
    preparing: { label: 'تحضير', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    ready: { label: 'جاهز', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', icon: <CheckCircle className="w-3 h-3" /> },
    delivered: { label: 'تم التوصيل', color: 'text-white/40', bg: 'bg-white/5 border-white/10', icon: <Truck className="w-3 h-3" /> },
    cancelled: { label: 'ملغي', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', icon: <AlertCircle className="w-3 h-3" /> },
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const c = STATUS_CONFIG[status];
    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", c.color, c.bg)}>
            {c.icon}{c.label}
        </span>
    );
};

const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
};

const elapsedMin = (ts: number) => Math.floor((Date.now() - ts) / 60000);

// ─── Sidebar ─────────────────────────────────────────────────────
const NAV = [
    { id: 'overview', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'الطلبات', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'analytics', label: 'التحليلات', icon: <BarChart3 className="w-4 h-4" /> },
];

const Sidebar = ({ active, setActive, onLogout, collapsed, setCollapsed }: {
    active: string; setActive: (id: string) => void; onLogout: () => void; collapsed: boolean; setCollapsed: (v: boolean) => void;
}) => (
    <aside className={cn("h-screen bg-sidebar border-l border-white/5 flex flex-col shrink-0 transition-all duration-300 overflow-hidden", collapsed ? "w-16" : "w-56")}>
        <div className={cn("p-4 border-b border-white/5 flex items-center", collapsed ? "justify-center" : "justify-between")}>
            {!collapsed && <span className="text-lg font-black italic text-primary tracking-tighter">CRUNCHY</span>}
            <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
            {NAV.map(item => (
                <button key={item.id} onClick={() => setActive(item.id)}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold",
                        active === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white hover:bg-white/5",
                        collapsed && "justify-center"
                    )}>
                    {item.icon}
                    {!collapsed && item.label}
                </button>
            ))}
        </nav>
        <div className={cn("p-3 border-t border-white/5 space-y-1", collapsed && "flex flex-col items-center")}>
            <button onClick={() => { window.location.hash = '/'; }}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all text-sm font-bold", collapsed && "justify-center")}>
                <Utensils className="w-4 h-4" />{!collapsed && "المنيو"}
            </button>
            <button onClick={onLogout}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-bold", collapsed && "justify-center")}>
                <LogOut className="w-4 h-4" />{!collapsed && "تسجيل الخروج"}
            </button>
        </div>
    </aside>
);

// ─── Metric Card ─────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, icon, trend }: { label: string; value: string | number; sub: string; icon: React.ReactNode; trend?: number }) => (
    <div className="metric-card rounded-2xl p-6 flex flex-col gap-4 hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
            {trend !== undefined && (
                <span className={cn("text-xs font-black flex items-center gap-1", trend >= 0 ? "text-green-400" : "text-red-400")}>
                    <ArrowUpRight className={cn("w-3 h-3", trend < 0 && "rotate-180")} />{Math.abs(trend)}%
                </span>
            )}
        </div>
        <div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-white/40 font-bold mt-1">{label}</p>
        </div>
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{sub}</p>
    </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────
const BarChart = ({ data }: { data: { date: string; revenue: number; orderCount: number }[] }) => {
    const max = Math.max(...data.map(d => d.revenue), 1);
    return (
        <div className="flex items-end gap-2 h-32">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[9px] font-black text-white/30">{d.revenue > 0 ? `${d.revenue}` : ''}</span>
                    <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: `${Math.max((d.revenue / max) * 100, 4)}%` }}>
                        <div className="absolute inset-0 bg-primary/60 hover:bg-primary transition-colors cursor-default rounded-t-lg" />
                    </div>
                    <span className="text-[9px] font-black text-white/30">{d.date}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Overview Page ────────────────────────────────────────────────
const OverviewPage = () => {
    const { orders, updateStatus } = useOrders();
    const { todayRevenue, ordersByStatus, weeklyStats, popularItems } = useAnalytics();
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="إيرادات اليوم" value={`${todayRevenue} ج.م`} sub="Today's Revenue" icon={<TrendingUp className="w-5 h-5" />} trend={12} />
                <MetricCard label="طلبات اليوم" value={orders.length} sub="Total Orders" icon={<ShoppingBag className="w-5 h-5" />} trend={8} />
                <MetricCard label="قيد التنفيذ" value={activeOrders.length} sub="Active Orders" icon={<Loader2 className="w-5 h-5" />} />
                <MetricCard label="جاهز للتوصيل" value={ordersByStatus.ready} sub="Ready Orders" icon={<CheckCircle className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Orders */}
                <div className="lg:col-span-2 metric-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-white">الطلبات الحية</h3>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-green-400 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live
                        </span>
                    </div>
                    <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar">
                        {activeOrders.length === 0 ? (
                            <div className="text-center py-8 text-white/20 font-bold">لا توجد طلبات نشطة</div>
                        ) : activeOrders.map(order => (
                            <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-black text-white text-sm">{order.trackingCode}</span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <p className="text-xs text-white/40 font-bold truncate">{order.customerName} • {order.items.length} عنصر</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-black text-primary text-sm">{order.total} ج.م</p>
                                    <p className="text-[10px] text-white/30">{elapsedMin(order.createdAt)} د</p>
                                </div>
                                <div className="flex gap-1">
                                    {order.status === 'pending' && (
                                        <button onClick={() => updateStatus(order.id, 'preparing')}
                                            className="text-[10px] font-black px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors whitespace-nowrap">تحضير</button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button onClick={() => updateStatus(order.id, 'ready')}
                                            className="text-[10px] font-black px-2 py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors whitespace-nowrap">جاهز</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Items */}
                <div className="metric-card rounded-2xl p-6">
                    <h3 className="font-black text-white mb-6 flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> الأكثر طلباً</h3>
                    <div className="space-y-3">
                        {popularItems.slice(0, 6).map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-primary/60 w-4">{i + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-black text-white/80 truncate max-w-[120px]">{item.name}</span>
                                        <span className="text-xs font-black text-white/40">{item.count}</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${(item.count / (popularItems[0]?.count || 1)) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Revenue Chart */}
            <div className="metric-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-white">إيرادات الأسبوع</h3>
                    <span className="text-xs font-black text-white/30 uppercase tracking-widest">7 أيام</span>
                </div>
                <BarChart data={weeklyStats} />
            </div>
        </div>
    );
};

// ─── Orders Page ──────────────────────────────────────────────────
const OrdersPage = () => {
    const { orders, updateStatus } = useOrders();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

    const filtered = orders.filter(o => {
        const matchSearch = o.trackingCode.includes(search) || o.customerName.includes(search) || o.customerPhone.includes(search);
        const matchFilter = filter === 'all' || o.status === filter;
        return matchSearch && matchFilter;
    });

    const exportData = () => {
        const blob = new Blob([JSON.stringify(orders, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'crunchy-orders.json'; a.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-xl font-black text-white">كل الطلبات</h2>
                <div className="flex gap-3 flex-wrap">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
                            className="bg-white/5 border border-white/10 rounded-xl pr-9 pl-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-44" />
                    </div>
                    <select value={filter} onChange={e => setFilter(e.target.value as OrderStatus | 'all')}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none text-white/60">
                        <option value="all">كل الحالات</option>
                        {(['pending', 'preparing', 'ready', 'delivered', 'cancelled'] as OrderStatus[]).map(s => (
                            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                        ))}
                    </select>
                    <button onClick={exportData} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors">
                        <Download className="w-3.5 h-3.5" /> تصدير
                    </button>
                </div>
            </div>

            <div className="metric-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['رمز الطلب', 'العميل', 'الهاتف', 'العناصر', 'الإجمالي', 'الوقت', 'الحالة', 'إجراء'].map(h => (
                                    <th key={h} className="px-4 py-3 text-right text-[10px] font-black text-white/30 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(order => (
                                <tr key={order.id} className="hover:bg-white/2 transition-colors">
                                    <td className="px-4 py-3 font-black text-primary text-xs">{order.trackingCode}</td>
                                    <td className="px-4 py-3 font-bold text-white/80 whitespace-nowrap">{order.customerName}</td>
                                    <td className="px-4 py-3 text-white/40 whitespace-nowrap">{order.customerPhone}</td>
                                    <td className="px-4 py-3 text-white/40">{order.items.length} عنصر</td>
                                    <td className="px-4 py-3 font-black text-white whitespace-nowrap">{order.total} ج.م</td>
                                    <td className="px-4 py-3 text-white/30 whitespace-nowrap">{formatTime(order.createdAt)}</td>
                                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            {order.status === 'pending' && <button onClick={() => updateStatus(order.id, 'preparing')} className="text-[10px] font-black px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">تحضير</button>}
                                            {order.status === 'preparing' && <button onClick={() => updateStatus(order.id, 'ready')} className="text-[10px] font-black px-2 py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">جاهز</button>}
                                            {order.status === 'ready' && <button onClick={() => updateStatus(order.id, 'delivered')} className="text-[10px] font-black px-2 py-1 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 transition-colors">توصيل</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="text-center py-12 text-white/20 font-bold">لا توجد طلبات</div>}
                </div>
            </div>
        </div>
    );
};

// ─── Analytics Page ───────────────────────────────────────────────
const AnalyticsPage = () => {
    const { weeklyStats, popularItems, ordersByStatus } = useAnalytics();
    const totalOrders = Object.values(ordersByStatus).reduce((s, v) => s + v, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="metric-card rounded-2xl p-6">
                    <h3 className="font-black text-white mb-6">الإيرادات الأسبوعية</h3>
                    <BarChart data={weeklyStats} />
                    <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                        <div><p className="text-lg font-black text-white">{weeklyStats.reduce((s, d) => s + d.revenue, 0)} ج.م</p><p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">إجمالي الأسبوع</p></div>
                        <div><p className="text-lg font-black text-white">{weeklyStats.reduce((s, d) => s + d.orderCount, 0)}</p><p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">طلبات الأسبوع</p></div>
                        <div>
                            <p className="text-lg font-black text-white">
                                {weeklyStats.reduce((s, d) => s + d.orderCount, 0) > 0 ? Math.round(weeklyStats.reduce((s, d) => s + d.revenue, 0) / weeklyStats.reduce((s, d) => s + d.orderCount, 0)) : 0} ج.م
                            </p>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">متوسط الطلب</p>
                        </div>
                    </div>
                </div>

                <div className="metric-card rounded-2xl p-6">
                    <h3 className="font-black text-white mb-6">توزيع الحالات</h3>
                    <div className="space-y-4">
                        {(Object.entries(ordersByStatus) as [OrderStatus, number][]).map(([status, count]) => {
                            const c = STATUS_CONFIG[status];
                            const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                            return (
                                <div key={status}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={cn("text-xs font-black", c.color)}>{c.label}</span>
                                        <span className="text-xs font-black text-white/40">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'rgb(186,0,39)' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="metric-card rounded-2xl p-6">
                <h3 className="font-black text-white mb-6">أداء المنتجات</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 border border-white/5">
                            <span className="text-2xl font-black text-primary/30">#{i + 1}</span>
                            <div className="flex-1">
                                <p className="font-black text-white text-sm">{item.name}</p>
                                <p className="text-xs text-white/30">{item.count} طلب • {item.revenue} ج.م إجمالي</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-primary">{Math.round(item.revenue / Math.max(item.count, 1))} ج.م</p>
                                <p className="text-[10px] text-white/30">متوسط</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────
export function ManagerDashboard() {
    const { user, logout } = useAuth();
    const [active, setActive] = useState('overview');
    const [collapsed, setCollapsed] = useState(false);
    const { orders } = useOrders(3000);
    const newCount = orders.filter(o => o.status === 'pending').length;

    const handleLogout = () => { logout(); window.location.hash = '/login'; };

    const pages: Record<string, React.ReactNode> = {
        overview: <OverviewPage />,
        orders: <OrdersPage />,
        analytics: <AnalyticsPage />,
    };

    return (
        <div className="flex h-screen bg-dashboard overflow-hidden font-body text-white" dir="rtl">
            <Sidebar active={active} setActive={setActive} onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-14 border-b border-white/5 bg-sidebar flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <h1 className="text-sm font-black text-white">{NAV.find(n => n.id === active)?.label}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white">
                            <Bell className="w-4 h-4" />
                            {newCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-black">
                                {user?.name?.[0] ?? 'M'}
                            </div>
                            <span className="text-xs font-bold text-white/60 hidden sm:block">{user?.name}</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            {pages[active]}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
