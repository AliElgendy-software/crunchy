import { useState, useCallback } from 'react';
import type { User, Role } from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const USERS = [
    { id: 'u-1', name: 'Ali Elgendy', email: 'manager@crunchy.com', password: 'password123', role: 'manager' as Role, branchId: 'branch-1' },
    { id: 'u-2', name: 'Mohamed Staff', email: 'staff@crunchy.com', password: 'password123', role: 'staff' as Role, branchId: 'branch-1' },
    { id: 'u-3', name: 'Admin Master', email: 'admin@crunchy.com', password: 'admin', role: 'admin' as Role, branchId: 'branch-1' },
];

const ROUTE_BY_ROLE: Record<Role, string> = {
    customer: '/',
    staff: '/kitchen',
    manager: '/dashboard',
    admin: '/admin',
};

const loadAuth = (): AuthState => {
    try {
        const saved = sessionStorage.getItem('crunchy_auth');
        if (saved) return JSON.parse(saved);
    } catch { }
    return { user: null, isAuthenticated: false };
};

let _state = loadAuth();
const listeners = new Set<() => void>();
const emitChange = () => listeners.forEach(fn => fn());

export function useAuth() {
    const [state, setState] = useState<AuthState>(_state);

    const login = useCallback((email: string, password: string) => {
        const found = USERS.find(u => u.email === email && u.password === password);
        if (!found) return null; // Invalid credentials

        const { password: _, ...user } = found;
        const next = { user, isAuthenticated: true };
        _state = next;
        sessionStorage.setItem('crunchy_auth', JSON.stringify(next));
        setState(next);
        emitChange();
        return ROUTE_BY_ROLE[user.role as Role];
    }, []);

    const logout = useCallback(() => {
        _state = { user: null, isAuthenticated: false };
        sessionStorage.removeItem('crunchy_auth');
        setState(_state);
        emitChange();
    }, []);

    const hasRole = useCallback((...roles: Role[]) => {
        return state.user ? roles.includes(state.user.role) : false;
    }, [state.user]);

    return { ...state, login, logout, hasRole };
}
