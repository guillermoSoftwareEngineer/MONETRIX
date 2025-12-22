import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
    constructor(private readonly budgetsService: BudgetsService) { }

    @Get()
    async getBudgets(@Request() req) {
        return this.budgetsService.findAll(req.user.userId);
    }

    @Post()
    async setBudget(@Request() req, @Body() body: { category: string, limit: number, id?: string }) {
        return this.budgetsService.updateBudget(req.user.userId, body.category, body.limit, body.id);
    }

    @Delete(':id')
    async deleteBudget(@Request() req, @Param('id') id: string) {
        return this.budgetsService.remove(id, req.user.userId);
    }
}
