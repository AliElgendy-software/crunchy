import { useState, useEffect } from 'react';
import { store } from '../store';
import type { Order, OrderStatus, MenuItem } from '../types';

export function useOrders(pollMs = 3000) {
    const [orders, setOrders] = useState<Order[]>(store.getOrders());

    useEffect(() => {
        const unsub = store.subscribe(() => setOrders(store.getOrders()));
        const interval = setInterval(() => setOrders(store.getOrders()), pollMs);
        return () => { unsub(); clearInterval(interval); };
    }, [pollMs]);

    const updateStatus = (id: string, status: OrderStatus) => store.updateOrderStatus(id, status);

    return { orders, updateStatus };
}

export function useMenu(pollMs = 0) {
    const [menu, setMenu] = useState<MenuItem[]>(store.getMenu());
    useEffect(() => {
        const unsub = store.subscribe(() => setMenu(store.getMenu()));
        const interval = pollMs > 0 ? setInterval(() => setMenu(store.getMenu()), pollMs) : null;
        return () => { unsub(); if (interval) clearInterval(interval); };
    }, [pollMs]);
    const updateItem = (id: string, updates: Partial<MenuItem>) => store.updateMenuItem(id, updates);
    const toggleAvailable = (id: string) => store.toggleItemAvailability(id);
    return { menu, updateItem, toggleAvailable };
}

export function useAnalytics() {
    const [, tick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => tick(n => n + 1), 5000);
        return () => clearInterval(interval);
    }, []);
    return {
        todayRevenue: store.getTodayRevenue(),
        weeklyStats: store.getWeeklyStats(),
        popularItems: store.getPopularItems(),
        ordersByStatus: store.getOrdersByStatus(),
    };
}

export function useBranch() {
    const [branch, setBranch] = useState(store.getBranch());
    useEffect(() => store.subscribe(() => setBranch(store.getBranch())), []);
    return { branch, updateBranch: store.updateBranch.bind(store) };
}
