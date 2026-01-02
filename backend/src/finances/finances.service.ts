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
          // Penalty: Exceeding budget costs 20 XP
          await this.usersService.updateXp(user.userId, -20);
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
      // Format: "Enero 2025"
      const monthName = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      // Capitalize first letter
      const formattedName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      const key = `${date.getMonth()}-${date.getFullYear()}`; // Keep sorting/grouping key internal if needed, but we rely on array order. 
      // Actually, distinct months might map to same name if we just use name.
      // But the loop is on 'rawData' which is sorted by date.
      // We need a map to aggregate.

      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Original ID key

      if (!history[monthYear]) {
        history[monthYear] = { name: formattedName, _sortKey: date.getTime() };
      }
      history[monthYear][category] = (history[monthYear][category] || 0) + Number(f.amount);
    });

    return Object.values(history);
  }

  async getFinancialSummary(user: any) {
    const finances = await this.findAll(user);
    const budgets = await this.budgetsService.findAll(user.userId);

    const totalIncome = finances.filter(f => f.type === 'INCOME').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalExpenses = finances.filter(f => f.type === 'EXPENSE').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalInvestments = finances.filter(f => f.type === 'INVESTMENT').reduce((acc, curr) => acc + Number(curr.amount), 0);

    const categories: any = {};
    finances.filter(f => f.type === 'EXPENSE').forEach(f => {
      categories[f.category] = (categories[f.category] || 0) + Number(f.amount);
    });

    const budgetStatus = budgets.map(b => ({
      category: b.category,
      limit: b.limit,
      spent: categories[b.category] || 0
    }));

    // Datos de Mercado (Validado Enero 2026)
    const marketOpporturnities = [
      { name: "Pibank Cuenta", rate: "12.00% EA", term: "A la vista" },
      { name: "Nu Cajitas", rate: "8.25% EA", term: "A la vista" },
      { name: "Pibank CDT", rate: "10.10% EA", term: "180 días" },
      { name: "RappiPay", rate: "9.00% EA", term: "Rentable" },
      { name: "Lulo Bank", rate: "10.00% EA", term: "Lulo Pro" }
    ];

    // EL BALANCE LÍQUIDO debe ser Ingresos - Gastos - Inversiones (para coincidir con el Dashboard)
    const liquidBalance = totalIncome - totalExpenses - totalInvestments;

    // EL PATRIMONIO NETO es Dinero Líquido + Inversiones (Lo que realmente posee el usuario)
    const netWorth = liquidBalance + totalInvestments;

    return {
      balance: liquidBalance,
      netWorth: netWorth,
      totalIncome,
      totalExpenses,
      totalInvestments,
      emergencyFundGoal: user.emergencyFundGoal || 0,
      savingsGoal: user.savingsGoal || 0,
      savingsFrequency: user.savingsFrequency || 'monthly',
      expensesByCategory: categories,
      budgetStatus,
      marketOpporturnities,
      movementCount: finances.length,
      currentInvestments: finances.filter(f => f.type === 'INVESTMENT').map(f => ({
        description: f.description,
        amount: f.amount,
        category: f.category
      }))
    };
  }

  async getProjections(user: any) {
    const finances = await this.findAll(user);
    const fullUser = await this.usersService.getUserWithApiKey(user.userId);

    if (!fullUser) throw new Error('User not found');

    const now = new Date();
    // Get last 3 months data
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const savingsItems = finances.filter(f =>
      (f.type === 'INVESTMENT' || (f.category && f.category.toLowerCase().includes('ahorro'))) &&
      new Date(f.date) >= threeMonthsAgo
    );

    const emergencyItems = finances.filter(f =>
      f.category && f.category.toLowerCase().includes('emergencia') &&
      new Date(f.date) >= threeMonthsAgo
    );

    const totalSavingsLast3Months = savingsItems.reduce((acc, curr) => {
      const amount = Number(curr.amount);
      return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
    }, 0);

    const totalEmergencyLast3Months = emergencyItems.reduce((acc, curr) => {
      const amount = Number(curr.amount);
      return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
    }, 0);

    const monthlySavingsAvg = totalSavingsLast3Months / 3;
    const monthlyEmergencyAvg = totalEmergencyLast3Months / 3;

    // Calculate months to goal (Accumulated vs Annual Goal)
    const currentSavings = finances
      .filter(f => f.type === 'INVESTMENT' || (f.category && f.category.toLowerCase().includes('ahorro')))
      .reduce((acc, curr) => {
        const amount = Number(curr.amount);
        return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
      }, 0);

    const currentEmergency = finances
      .filter(f => f.category && f.category.toLowerCase().includes('emergencia'))
      .reduce((acc, curr) => {
        const amount = Number(curr.amount);
        return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
      }, 0);

    // YTD Logic
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const savingsYTD = finances
      .filter(f => (f.type === 'INVESTMENT' || (f.category && f.category.toLowerCase().includes('ahorro'))) && new Date(f.date) >= startOfYear)
      .reduce((acc, curr) => {
        const amount = Number(curr.amount);
        return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
      }, 0);

    const emergencyYTD = finances
      .filter(f => (f.category && f.category.toLowerCase().includes('emergencia')) && new Date(f.date) >= startOfYear)
      .reduce((acc, curr) => {
        const amount = Number(curr.amount);
        return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
      }, 0);

    const savingsMonthlyGoal = Number(fullUser.savingsGoal) || 0;
    const emergencyMonthlyGoal = Number(fullUser.emergencyFundGoal) || 0;

    const savingsAnnualGoal = savingsMonthlyGoal * 12;
    const emergencyAnnualGoal = emergencyMonthlyGoal * 12;

    // Calculate months to Annual Goal (Total Accumulated vs Annual Target)
    let savingsMonthsToGoal = 0;
    if (savingsAnnualGoal > currentSavings && monthlySavingsAvg > 0) {
      savingsMonthsToGoal = Math.ceil((savingsAnnualGoal - currentSavings) / monthlySavingsAvg);
    }

    let emergencyMonthsToGoal = 0;
    if (emergencyAnnualGoal > currentEmergency && monthlyEmergencyAvg > 0) {
      emergencyMonthsToGoal = Math.ceil((emergencyAnnualGoal - currentEmergency) / monthlyEmergencyAvg);
    }

    return {
      savings: {
        current: currentSavings,
        goal: savingsAnnualGoal, // Using Annual as Total Target
        monthlyAverage: monthlySavingsAvg,
        monthsToGoal: savingsMonthsToGoal,
        projectedDate: savingsMonthsToGoal > 0 ? new Date(now.setMonth(now.getMonth() + savingsMonthsToGoal)) : null
      },
      emergency: {
        current: currentEmergency,
        goal: emergencyAnnualGoal, // Using Annual as Total Target
        monthlyAverage: monthlyEmergencyAvg,
        monthsToGoal: emergencyMonthsToGoal,
        projectedDate: emergencyMonthsToGoal > 0 ? new Date(now.setMonth(now.getMonth() + emergencyMonthsToGoal)) : null
      },
      annual: { // Savings Annual Vision
        year: now.getFullYear(),
        monthlyGoal: savingsMonthlyGoal,
        annualGoal: savingsAnnualGoal,
        currentYTD: savingsYTD,
        projectedEndYear: savingsYTD + (monthlySavingsAvg * (12 - (new Date().getMonth() + 1))),
        progress: savingsAnnualGoal > 0 ? (savingsYTD / savingsAnnualGoal) * 100 : 0
      },
      annualEmergency: { // Emergency Annual Vision
        year: now.getFullYear(),
        monthlyGoal: emergencyMonthlyGoal,
        annualGoal: emergencyAnnualGoal,
        currentYTD: emergencyYTD,
        projectedEndYear: emergencyYTD + (monthlyEmergencyAvg * (12 - (new Date().getMonth() + 1))),
        progress: emergencyAnnualGoal > 0 ? (emergencyYTD / emergencyAnnualGoal) * 100 : 0
      }
    };
  }

  async getGoalsAnalytics(user: any) {
    const finances = await this.findAll(user);
    const fullUser = await this.usersService.getUserWithApiKey(user.userId);

    if (!fullUser) throw new Error('User not found');

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Filter finances by relevance to goals (Ahorro / Inversiones / Fondo Emergencia)
    const savingsItems = finances.filter(f =>
      f.type === 'INVESTMENT' ||
      (f.category && f.category.toLowerCase().includes('ahorro'))
    );

    const emergencyItems = finances.filter(f =>
      f.category && f.category.toLowerCase().includes('emergencia')
    );

    const savingsActual = savingsItems.reduce((acc, curr) => {
      const amount = Number(curr.amount);
      return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
    }, 0);
    const emergencyActual = emergencyItems.reduce((acc, curr) => {
      const amount = Number(curr.amount);
      return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
    }, 0);

    const savingsThisMonth = savingsItems
      .filter(f => new Date(f.date) >= startOfMonth)
      .reduce((acc, curr) => {
        const amount = Number(curr.amount);
        return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
      }, 0);

    const emergencyThisMonth = emergencyItems
      .filter(f => new Date(f.date) >= startOfMonth)
      .reduce((acc, curr) => {
        const amount = Number(curr.amount);
        return curr.type === 'EXPENSE' ? acc - amount : acc + amount;
      }, 0);

    return {
      savings: {
        goal: Number(fullUser.savingsGoal) || 0,
        actual: savingsActual,
        thisMonth: savingsThisMonth,
        frequency: fullUser.savingsFrequency
      },
      emergencyFund: {
        goal: Number(fullUser.emergencyFundGoal) || 0,
        actual: emergencyActual,
        thisMonth: emergencyThisMonth
      }
    };
  }
}
