import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BudgetsService {
    constructor(
        @InjectRepository(Budget)
        private budgetsRepository: Repository<Budget>,
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
        await this.budgetsRepository.delete({ id, user: { id: userId } });
    }

    async findByCategory(userId: string, category: string): Promise<Budget | null> {
        return this.budgetsRepository.findOne({
            where: { category, user: { id: userId } }
        });
    }
}
