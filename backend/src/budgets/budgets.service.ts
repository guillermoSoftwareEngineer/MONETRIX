import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { User } from '../users/entities/user.entity';
import { Finance } from '../finances/entities/finance.entity';

@Injectable()
export class BudgetsService {
    constructor(
        @InjectRepository(Budget)
        private budgetsRepository: Repository<Budget>,
        @InjectRepository(Finance)
        private financesRepository: Repository<Finance>,
    ) { }

    async findAll(userId: string): Promise<Budget[]> {
        return this.budgetsRepository.find({
            where: { user: { id: userId } },
            order: { category: 'ASC' }
        });
    }

    async findOne(id: string, userId: string): Promise<Budget | null> {
        return this.budgetsRepository.findOne({
            where: { id, user: { id: userId } }
        });
    }

    async updateBudget(userId: string, category: string, limit: number, id?: string): Promise<Budget> {
        let budget: Budget | null = null;

        if (id) {
            budget = await this.findOne(id, userId);
        }

        if (budget) {
            budget.category = category;
            budget.limit = limit;
        } else {
            budget = this.budgetsRepository.create({
                category,
                limit,
                user: { id: userId } as User
            });
        }

        return this.budgetsRepository.save(budget);
    }

    async remove(id: string, userId: string): Promise<void> {
        const budget = await this.findOne(id, userId);
        if (budget) {
            await this.budgetsRepository.remove(budget);
        }
    }

    async findByCategory(userId: string, category: string): Promise<Budget | null> {
        return this.budgetsRepository.findOne({
            where: { category, user: { id: userId } }
        });
    }

    async getBudgetComparison(userId: string) {
        const budgets = await this.findAll(userId);
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const comparison = await Promise.all(budgets.map(async (budget) => {
            const expenses = await this.financesRepository.find({
                where: {
                    user: { id: userId },
                    category: budget.category,
                    type: 'EXPENSE' as any,
                }
            });

            // Filtrar gastos del mes actual localmente
            const monthlyExpenses = expenses.filter(f => new Date(f.date) >= startOfMonth);
            const totalSpent = monthlyExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

            return {
                category: budget.category,
                limit: Number(budget.limit),
                spent: totalSpent,
                remaining: Math.max(0, Number(budget.limit) - totalSpent),
                percentage: (totalSpent / Number(budget.limit)) * 100
            };
        }));

        return comparison;
    }
}
