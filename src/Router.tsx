import { useState, useEffect } from 'react';
import { CustomerApp } from './apps/customer/CustomerApp';
import { ManagerDashboard } from './apps/dashboard/ManagerDashboard';
import { KitchenDisplay } from './apps/kitchen/KitchenDisplay';
import { AdminPanel } from './apps/admin/AdminPanel';
import { LoginPage } from './apps/auth/LoginPage';
import { useAuth } from './shared/hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';

const getRoute = () => {
    const hash = window.location.hash.replace('#', '').split('?')[0] || '/';
    return hash;
};

const PROTECTED: Record<string, ('manager' | 'admin' | 'staff')[]> = {
    '/dashboard': ['manager', 'admin'],
    '/kitchen': ['staff', 'manager', 'admin'],
    '/admin': ['admin'],
};

export function Router() {
    const [route, setRoute] = useState(getRoute());
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const onHash = () => setRoute(getRoute());
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    const navigate = (to: string) => {
        window.location.hash = to;
    };

    // Check access
    const requiredRoles = PROTECTED[route];
    if (requiredRoles) {
        if (!isAuthenticated) { navigate('/login'); return null; }
        if (!user || !requiredRoles.includes(user.role as 'manager' | 'admin' | 'staff')) {
            navigate('/login'); return null;
        }
    }

    const renderPage = () => {
        if (route === '/login') return <LoginPage />;
        if (route.startsWith('/dashboard')) return <ManagerDashboard />;
        if (route === '/kitchen') return <KitchenDisplay />;
        if (route === '/admin') return <AdminPanel />;
        return <CustomerApp />;
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={route}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-screen"
            >
                {renderPage()}
            </motion.div>
        </AnimatePresence>
    );
}
