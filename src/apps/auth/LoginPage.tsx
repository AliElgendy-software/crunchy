import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Utensils, LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';

export function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const dest = login(email, password);
            if (dest) {
                window.location.hash = dest;
            } else {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-3xl font-black italic tracking-tighter text-white">CRUNCHY</span>
                    </div>
                    <p className="text-sm font-bold text-white/40 uppercase tracking-[0.3em] font-body">OrderOS — تسجيل الدخول</p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/3 border border-white/8 rounded-3xl p-8 backdrop-blur-xl font-body"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <LogIn className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-black text-white">تسجيل الدخول</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@crunchy.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full bg-primary text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'دخول'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-xs text-center font-bold text-white/30 mb-3">حسابات تجريبية:</p>
                        <div className="flex flex-col gap-2 text-[10px] text-white/40 bg-white/5 p-3 rounded-xl uppercase tracking-widest font-mono">
                            <div className="flex justify-between items-center"><span className="text-purple-400 font-bold">Admin</span><span>admin@crunchy.com / admin</span></div>
                            <div className="flex justify-between items-center"><span className="text-blue-400 font-bold">Manager</span><span>manager@crunchy.com / password123</span></div>
                            <div className="flex justify-between items-center"><span className="text-orange-400 font-bold">Kitchen</span><span>staff@crunchy.com / password123</span></div>
                        </div>
                    </div>

                    <button
                        onClick={() => { window.location.hash = '/'; }}
                        className="w-full mt-6 text-center text-xs font-black text-white/30 hover:text-primary transition-colors uppercase tracking-widest py-2"
                    >
                        ← العودة للمنيو
                    </button>
                </motion.div>

                <p className="text-center text-[10px] text-white/20 font-bold mt-8 uppercase tracking-widest font-body">
                    Developed by Ali Elgendy · Crunchy OrderOS v2.0
                </p>
            </div>
        </div>
    );
}
