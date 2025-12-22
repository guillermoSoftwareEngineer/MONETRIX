import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from '../lib/api';

export enum FinanceType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    INVESTMENT = 'INVESTMENT',
}

export interface FinanceRequest {
    amount: number;
    description: string;
    type: FinanceType;
    category?: string;
    interestRate?: number;
    startDate?: string;
    endDate?: string;
    currency?: string;
}

export interface Finance extends FinanceRequest {
    id: string;
    date: string;
    createdAt: string;
}

export function useFinances() {
    const [finances, setFinances] = useState<Finance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFinances = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchAPI('/finances');
            setFinances(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addFinance = async (finance: FinanceRequest) => {
        try {
            const data = await fetchAPI('/finances', {
                method: 'POST',
                body: JSON.stringify(finance),
            });
            await fetchFinances(); // Recargar lista
            return {
                success: true,
                leveledUp: data.leveledUp,
                budgetExceeded: data.budgetExceeded
            };
        } catch (err: any) {
            setError(err.message);
            return { success: false, leveledUp: false, budgetExceeded: false };
        }
    };

    const removeFinance = async (id: string) => {
        try {
            await fetchAPI(`/finances/${id}`, {
                method: 'DELETE',
            });
            await fetchFinances();
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    };

    useEffect(() => {
        fetchFinances();
    }, [fetchFinances]);

    return { finances, loading, error, addFinance, removeFinance, refresh: fetchFinances };
}
