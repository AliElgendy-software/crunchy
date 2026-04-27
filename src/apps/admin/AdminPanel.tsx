import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Shield, Utensils, Users, Settings, LogOut, Plus, Edit2,
    ToggleLeft, ToggleRight, Save, X, ChevronRight, Building2,
    Tag, ChefHat, LayoutDashboard
} from 'lucide-react';
import { useMenu, useBranch } from '../../shared/hooks/useStore';
import { useAuth } from '../../shared/hooks/useAuth';
import { cn } from '../../lib/utils';
import type { MenuItem, MenuCategory } from '../../shared/types';

// ─── Category Labels ──────────────────────────────────────────────
const CATEGORY_LABELS: Record<MenuCategory, string> = {
    crepeCorner: 'ركن الكريب',
    crepeMixes: 'ميكسات الكريب',
    mixesCorner: 'ركن الميكسات',
    chickenBurgers: 'برجر الدجاج',
    beefBurgers: 'برجر اللحم',
    negresco: 'نجرسكو',
    pizza: 'بيتزا',
    extras: 'إضافات',
};

// ─── Sidebar Nav ──────────────────────────────────────────────────
const ADMIN_NAV: { id: string; label: string; icon: ReactNode }[] = [
    { id: 'menu', label: 'إدارة المنيو', icon: <Utensils className="w-4 h-4" /> },
    { id: 'staff', label: 'الطاقم', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-4 h-4" /> },
    { id: 'saas', label: 'الاشتراكات', icon: <Tag className="w-4 h-4" /> },
];

// ─── Edit Modal ───────────────────────────────────────────────────
const EditItemModal = ({
    item, onSave, onClose,
}: { item: MenuItem; onSave: (updates: Partial<MenuItem>) => void; onClose: () => void }) => {
    const [name, setName] = useState(item.name);
    const [prices, setPrices] = useState({ ...item.prices });

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0d1117] border border-white/10 rounded-3xl p-8 w-full max-w-md space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white">تعديل العنصر</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40"><X className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">اسم العنصر</label>
                        <input value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 block">الأسعار</label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(prices).map(([key, val]) => (
                                <div key={key} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                                    <span className="text-[10px] font-black text-white/30 uppercase w-8">{key}</span>
                                    <input
                                        type="number" value={val}
                                        onChange={e => setPrices(p => ({ ...p, [key]: Number(e.target.value) }))}
                                        className="flex-1 bg-transparent text-sm font-black text-white focus:outline-none"
                                    />
                                    <span className="text-[10px] text-white/20">ج.م</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => { onSave({ name, prices }); onClose(); }}
                    className="w-full bg-primary text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Save className="w-4 h-4" /> حفظ التغييرات
                </button>
            </motion.div>
        </motion.div>
    );
};

// ─── Menu Manager Tab ─────────────────────────────────────────────
const MenuManagerTab = () => {
    const { menu, updateItem, toggleAvailable } = useMenu();
    const [editTarget, setEditTarget] = useState<MenuItem | null>(null);
    const [filterCategory, setFilterCategory] = useState<MenuCategory | 'all'>('all');
    const [search, setSearch] = useState('');

    const categories = [...new Set(menu.map(m => m.category))] as MenuCategory[];
    const filtered = menu.filter(m => {
        const matchCat = filterCategory === 'all' || m.category === filterCategory;
        const matchSearch = m.name.includes(search);
        return matchCat && matchSearch;
    });

    const grouped = filtered.reduce((acc, item) => {
        const cat = item.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في المنيو..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-full sm:w-52" />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as MenuCategory | 'all')}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none text-white/60">
                    <option value="all">كل الأقسام</option>
                    {categories.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
                <div className="text-xs text-white/30 font-bold mr-auto">{filtered.length} عنصر</div>
            </div>

            {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="metric-card rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
                        <span className="text-xs font-black text-primary uppercase tracking-widest">{CATEGORY_LABELS[cat as MenuCategory]}</span>
                        <span className="text-[10px] text-white/20 font-bold">{items.length} عنصر</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {items.map(item => (
                            <div key={item.id} className={cn("flex items-center gap-4 px-5 py-3 hover:bg-white/2 transition-colors", !item.available && "opacity-40")}>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-white text-sm">{item.name}</p>
                                    <div className="flex gap-1.5 flex-wrap mt-1">
                                        {Object.entries(item.prices).map(([k, v]) => (
                                            <span key={k} className="text-[9px] font-black bg-white/5 text-white/40 px-2 py-0.5 rounded-full uppercase">{k}: {v}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => toggleAvailable(item.id)} className="text-white/30 hover:text-primary transition-colors">
                                        {item.available ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
                                    </button>
                                    <button onClick={() => setEditTarget(item)}
                                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/30 hover:text-white">
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <AnimatePresence>
                {editTarget && (
                    <EditItemModal
                        item={editTarget}
                        onSave={updates => updateItem(editTarget.id, updates)}
                        onClose={() => setEditTarget(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Staff Tab ────────────────────────────────────────────────────
const DEMO_STAFF = [
    { id: 'u-1', name: 'Ali Elgendy', role: 'manager', email: 'manager@crunchy.com', status: 'active' },
    { id: 'u-2', name: 'Mohamed Staff', role: 'staff', email: 'staff@crunchy.com', status: 'active' },
    { id: 'u-3', name: 'Admin Master', role: 'admin', email: 'admin@crunchy.com', status: 'active' },
];

const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    manager: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    staff: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const StaffTab = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <p className="text-xs text-white/30 font-bold">{DEMO_STAFF.length} موظف نشط</p>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-primary/90 transition-colors">
                <Plus className="w-3.5 h-3.5" /> إضافة موظف
            </button>
        </div>
        <div className="metric-card rounded-2xl overflow-hidden">
            {DEMO_STAFF.map((s, i) => (
                <div key={s.id} className={cn("flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors", i > 0 && "border-t border-white/5")}>
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                        {s.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-white text-sm">{s.name}</p>
                        <p className="text-xs text-white/30">{s.email}</p>
                    </div>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border", ROLE_COLORS[s.role])}>
                        {s.role}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

// ─── Settings Tab ─────────────────────────────────────────────────
const SettingsTab = () => {
    const { branch, updateBranch } = useBranch();
    const [form, setForm] = useState(branch);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateBranch(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-xl">
            <div className="metric-card rounded-2xl p-6 space-y-5">
                <h3 className="font-black text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> معلومات المطعم</h3>
                {([
                    { key: 'name', label: 'اسم الفرع', type: 'text' },
                    { key: 'address', label: 'العنوان', type: 'text' },
                    { key: 'phone', label: 'رقم الهاتف', type: 'tel' },
                    { key: 'whatsapp', label: 'واتساب (كود الدولة)', type: 'tel' },
                ] as { key: keyof typeof form; label: string; type: string }[]).map(field => (
                    <div key={field.key}>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5 block">{field.label}</label>
                        <input
                            type={field.type}
                            value={form[field.key]}
                            onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                ))}
                <button onClick={handleSave} className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all",
                    saved ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-primary text-white hover:bg-primary/90")}>
                    <Save className="w-4 h-4" /> {saved ? "تم الحفظ ✓" : "حفظ الإعدادات"}
                </button>
            </div>
        </div>
    );
};

// ─── SaaS Tab ─────────────────────────────────────────────────────
const SaasTab = () => (
    <div className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
                { name: 'Starter', price: 'مجاني', features: ['فرع واحد', '100 طلب/شهر', 'منيو أساسي'], current: false },
                { name: 'Pro', price: '299 ج.م/شهر', features: ['3 فروع', 'طلبات غير محدودة', 'Dashboard', 'Kitchen Display'], current: true },
                { name: 'Enterprise', price: 'تواصل معنا', features: ['فروع غير محدودة', 'API كامل', 'White Label', 'Support مخصص'], current: false },
            ].map(plan => (
                <div key={plan.name} className={cn("metric-card rounded-2xl p-6 space-y-4", plan.current && "border-primary/40 bg-primary/5")}>
                    {plan.current && <span className="text-[9px] font-black text-primary uppercase tracking-widest">الخطة الحالية</span>}
                    <div>
                        <h3 className="text-xl font-black text-white">{plan.name}</h3>
                        <p className="text-lg font-black text-primary mt-1">{plan.price}</p>
                    </div>
                    <ul className="space-y-2">
                        {plan.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm text-white/60 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{f}
                            </li>
                        ))}
                    </ul>
                    <button className={cn("w-full py-2.5 rounded-xl font-black text-sm transition-colors",
                        plan.current ? "bg-primary text-white hover:bg-primary/90" : "bg-white/5 text-white/40 hover:bg-white/10")}>
                        {plan.current ? "خطتك الحالية" : "ترقية"}
                    </button>
                </div>
            ))}
        </div>
    </div>
);

// ─── Main Admin Panel ─────────────────────────────────────────────
export function AdminPanel() {
    const { user, logout } = useAuth();
    const [active, setActive] = useState('menu');

    const handleLogout = () => { logout(); window.location.hash = '/login'; };

    const pages: Record<string, ReactNode> = {
        menu: <MenuManagerTab />,
        staff: <StaffTab />,
        settings: <SettingsTab />,
        saas: <SaasTab />,
    };

    return (
        <div className="flex h-screen bg-dashboard font-body text-white overflow-hidden" dir="rtl">
            {/* Sidebar */}
            <aside className="w-56 bg-sidebar border-l border-white/5 flex flex-col shrink-0">
                <div className="p-5 border-b border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-lg font-black italic text-primary tracking-tighter">CRUNCHY</span>
                    </div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Admin Panel</p>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {ADMIN_NAV.map(item => (
                        <button key={item.id} onClick={() => setActive(item.id)}
                            className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold",
                                active === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white hover:bg-white/5")}>
                            {item.icon}{item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-white/5 space-y-1">
                    <button onClick={() => { window.location.hash = '/dashboard'; }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                        <LayoutDashboard className="w-4 h-4" />Dashboard
                    </button>
                    <button onClick={() => { window.location.hash = '/kitchen'; }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                        <ChefHat className="w-4 h-4" />المطبخ
                    </button>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-bold">
                        <LogOut className="w-4 h-4" />تسجيل الخروج
                    </button>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 border-b border-white/5 bg-sidebar flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <h1 className="text-sm font-black text-white">{ADMIN_NAV.find(n => n.id === active)?.label}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-black">
                            {user?.name?.[0] ?? 'A'}
                        </div>
                        <span className="text-xs text-white/40 font-bold">{user?.name}</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                            {pages[active]}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
