import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Clock, CheckCircle, Loader2, Bell, LogOut, Package, AlertTriangle } from 'lucide-react';
import { useOrders } from '../../shared/hooks/useStore';
import { useAuth } from '../../shared/hooks/useAuth';
import { cn } from '../../lib/utils';
import type { Order, OrderStatus } from '../../shared/types';

// ─── Helpers ─────────────────────────────────────────────────────
const useTimer = () => {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setTick(n => n + 1), 1000);
        return () => clearInterval(t);
    }, []);
    return tick;
};

const elapsed = (ts: number) => {
    const secs = Math.floor((Date.now() - ts) / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
};

const timerColor = (ts: number) => {
    const mins = (Date.now() - ts) / 60000;
    if (mins > 20) return 'text-red-400';
    if (mins > 10) return 'text-yellow-400';
    return 'text-green-400';
};

// ─── Order Card ───────────────────────────────────────────────────
const KitchenCard = ({
    order, onAction, actionLabel, actionColor, isNew,
}: {
    order: Order;
    onAction: () => void;
    actionLabel: string;
    actionColor: string;
    isNew?: boolean;
}) => {
    useTimer(); // force re-render for timer
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
                "rounded-2xl border p-5 flex flex-col gap-4 transition-all",
                isNew
                    ? "bg-primary/10 border-primary/40 shadow-[0_0_30px_rgba(186,0,39,0.2)]"
                    : "bg-white/3 border-white/8 hover:border-white/15"
            )}
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-lg font-black text-white">{order.trackingCode}</span>
                    {isNew && (
                        <span className="mr-2 text-[9px] font-black text-primary uppercase tracking-widest animate-pulse">جديد!</span>
                    )}
                    <p className="text-xs text-white/40 font-bold mt-0.5">{order.customerName}</p>
                </div>
                <div className={cn("font-black text-lg tabular-nums", timerColor(order.createdAt))}>
                    <Clock className="w-3 h-3 inline ml-1 mb-0.5" />
                    {elapsed(order.createdAt)}
                </div>
            </div>

            {/* Items */}
            <div className="space-y-1.5">
                {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-black text-sm">×{item.quantity}</span>
                            <span className="text-white/80 font-bold text-sm">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-white/30 font-bold uppercase bg-white/5 px-2 py-0.5 rounded-full">{item.size}</span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-white/8">
                <span className="text-xs text-white/30 font-bold">{order.items.reduce((s, i) => s + i.quantity, 0)} عنصر</span>
                <span className="font-black text-primary">{order.total} ج.م</span>
            </div>

            {/* Action */}
            <button onClick={onAction}
                className={cn("w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95", actionColor)}>
                {actionLabel}
            </button>
        </motion.div>
    );
};

// ─── Column ───────────────────────────────────────────────────────
const Column = ({
    title, orders, status, onAction, actionLabel, actionColor, icon, accent,
}: {
    title: string;
    orders: Order[];
    status: OrderStatus;
    onAction: (id: string) => void;
    actionLabel: string;
    actionColor: string;
    icon: ReactNode;
    accent: string;
}) => {
    return (
        <div className="flex flex-col h-full min-w-[300px]">
            {/* Column Header */}
            <div className={cn("flex items-center gap-3 p-4 rounded-2xl mb-4 border", accent)}>
                {icon}
                <h2 className="font-black text-white flex-1">{title}</h2>
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm font-black text-white">
                    {orders.length}
                </span>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
                <AnimatePresence mode="popLayout">
                    {orders.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-40 text-white/10 gap-3">
                            <Package className="w-10 h-10" />
                            <p className="font-black text-sm">لا توجد طلبات</p>
                        </motion.div>
                    ) : orders.map((order, i) => (
                        <KitchenCard
                            key={order.id}
                            order={order}
                            onAction={() => onAction(order.id)}
                            actionLabel={actionLabel}
                            actionColor={actionColor}
                            isNew={i === 0 && order.status === 'pending'}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ─── Main Kitchen Display ─────────────────────────────────────────
export function KitchenDisplay() {
    const { orders, updateStatus } = useOrders(2000);
    const { user, logout } = useAuth();
    const [prevCount, setPrevCount] = useState(0);
    const [hasAlert, setHasAlert] = useState(false);

    const pending = orders.filter(o => o.status === 'pending');
    const preparing = orders.filter(o => o.status === 'preparing');
    const ready = orders.filter(o => o.status === 'ready');

    // Alert on new pending orders
    useEffect(() => {
        if (pending.length > prevCount) { setHasAlert(true); }
        setPrevCount(pending.length);
    }, [pending.length]);

    useEffect(() => {
        if (hasAlert) {
            document.title = '🔔 طلب جديد! — Crunchy Kitchen';
            const t = setTimeout(() => { setHasAlert(false); document.title = 'Crunchy Kitchen'; }, 5000);
            return () => clearTimeout(t);
        }
    }, [hasAlert]);

    const handleLogout = () => { logout(); window.location.hash = '/login'; };

    return (
        <div className="h-screen bg-dashboard flex flex-col font-body text-white overflow-hidden" dir="rtl">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-6 py-3 bg-sidebar border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                        <ChefHat className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="text-base font-black italic text-white tracking-tighter">CRUNCHY</span>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mr-2">Kitchen Display</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <AnimatePresence>
                        {hasAlert && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5">
                                <Bell className="w-3.5 h-3.5 text-primary animate-bounce" />
                                <span className="text-xs font-black text-primary">طلب جديد!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Live clock */}
                    <LiveClock />

                    <span className="text-xs font-bold text-white/30">{user?.name}</span>
                    <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/30 hover:text-red-400">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Summary bar */}
            <div className="flex items-center gap-6 px-6 py-2 bg-black/20 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2 text-yellow-400">
                    <span className="text-xl font-black">{pending.length}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-yellow-400/60">انتظار</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-2 text-blue-400">
                    <span className="text-xl font-black">{preparing.length}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400/60">تحضير</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-2 text-green-400">
                    <span className="text-xl font-black">{ready.length}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-400/60">جاهز</span>
                </div>
                <div className="mr-auto">
                    <button onClick={() => { window.location.hash = '/dashboard'; }}
                        className="text-[10px] font-black text-white/20 hover:text-primary transition-colors uppercase tracking-widest">
                        ← لوحة التحكم
                    </button>
                </div>
            </div>

            {/* Columns */}
            <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
                <Column
                    title="قيد الانتظار" status="pending" orders={pending}
                    onAction={id => updateStatus(id, 'preparing')}
                    actionLabel="بدأ التحضير →"
                    actionColor="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                    icon={<AlertTriangle className="w-4 h-4 text-yellow-400" />}
                    accent="bg-yellow-400/5 border-yellow-400/20"
                />
                <Column
                    title="جارٍ التحضير" status="preparing" orders={preparing}
                    onAction={id => updateStatus(id, 'ready')}
                    actionLabel="جاهز للتسليم ✓"
                    actionColor="bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                    icon={<Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                    accent="bg-blue-400/5 border-blue-400/20"
                />
                <Column
                    title="جاهز للتسليم" status="ready" orders={ready}
                    onAction={id => updateStatus(id, 'delivered')}
                    actionLabel="تم التسليم ✓"
                    actionColor="bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
                    icon={<CheckCircle className="w-4 h-4 text-green-400" />}
                    accent="bg-green-400/5 border-green-400/20"
                />
            </div>
        </div>
    );
}

// ─── Live Clock ───────────────────────────────────────────────────
function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <span className="text-sm font-black text-white/50 tabular-nums">
            {time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    );
}
