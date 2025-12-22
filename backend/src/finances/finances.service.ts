import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Finance } from './entities/finance.entity';
import { UsersService } from '../users/users.service';
import { BudgetsService } from '../budgets/budgets.service';

@Injectable()
export class FinancesService {
  constructor(
    @InjectRepository(Finance)
    private financesRepository: Repository<Finance>,
    private usersService: UsersService,
    private budgetsService: BudgetsService,
  ) { }

  async create(createFinanceDto: any, user: any) {
    const { currency, amount } = createFinanceDto;
    let exchangeRate = 1;
    let finalAmount = Number(amount);

    if (currency === 'USD') {
      exchangeRate = 4000;
      finalAmount = amount * exchangeRate;
    } else if (currency === 'EUR') {
      exchangeRate = 4300;
      finalAmount = amount * exchangeRate;
    }

    const finance = await this.financesRepository.save(
      this.financesRepository.create({
        ...createFinanceDto,
        amount: finalAmount,
        originalAmount: amount,
        exchangeRate,
        user: { id: user.userId } as any,
      })
    );

    // Gamification: Award 10 XP for logging a movement
    const { leveledUp } = await this.usersService.addXp(user.userId, 10);

    // Budget check
    let budgetExceeded = false;
    if (createFinanceDto.type === 'EXPENSE' && createFinanceDto.category) {
      const budget = await this.budgetsService.findByCategory(user.userId, createFinanceDto.category as string);
      if (budget) {
        // Calculate total spent in this category for this month (simplified for now)
        // Note: In a real application, currency conversion would be handled here if multiple currencies are supported.
        const expenses = await this.financesRepository.find({
          where: {
            user: { id: user.userId },
            category: createFinanceDto.category as string,
            type: 'EXPENSE' as any
          }
        });
        const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

        if (totalSpent > Number(budget.limit)) {
          budgetExceeded = true;
        }
      }
    }

    return { finance, leveledUp, budgetExceeded };
  }

  findAll(user: any) {
    return this.financesRepository.find({
      where: { user: { id: user.userId } },
      order: { date: 'DESC' }
    });
  }

  findOne(id: string) {
    return this.financesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto) {
    await this.financesRepository.update(id, updateFinanceDto);
    return this.findOne(id);
  }

  async remove(id: string, user: any) {
    const result = await this.financesRepository.delete({ id, user: { id: user.userId } });
    if (result.affected === 0) {
      throw new Error(`Finance with ID "${id}" not found or unauthorized`);
    }
    return result;
  }

  async getCategoryHistory(user: any) {
    const rawData = await this.financesRepository.find({
      where: { user: { id: user.userId }, type: 'EXPENSE' as any },
      order: { date: 'ASC' }
    });

    const history: any = {};
    // Grouping by Month-Year and then by Category
    rawData.forEach(f => {
      const date = new Date(f.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const category = f.category || 'General';

      if (!history[monthYear]) {
        history[monthYear] = { name: monthYear };
      }
      history[monthYear][category] = (history[monthYear][category] || 0) + Number(f.amount);
    });

    return Object.values(history);
  }
}
