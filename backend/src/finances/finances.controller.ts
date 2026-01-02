import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { AIService } from './ai.service';
import { UsersService } from '../users/users.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('finances')
@UseGuards(JwtAuthGuard)
export class FinancesController {
  constructor(
    private readonly financesService: FinancesService,
    private readonly aiService: AIService,
    private readonly usersService: UsersService
  ) { }

  @Post()
  create(@Body() createFinanceDto: CreateFinanceDto, @Request() req) {
    return this.financesService.create(createFinanceDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.financesService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinanceDto: UpdateFinanceDto) {
    return this.financesService.update(id, updateFinanceDto);
  }

  @Get('analytics/history')
  getHistory(@Request() req) {
    return this.financesService.getCategoryHistory(req.user);
  }

  @Get('analytics/goals')
  getGoals(@Request() req) {
    return this.financesService.getGoalsAnalytics(req.user);
  }

  @Post('ai/ask')
  async askAI(@Body() body: { question: string }, @Request() req) {
    try {
      const user = await this.usersService.getUserWithApiKey(req.user.userId);
      const financialSummary = await this.financesService.getFinancialSummary(user || req.user);
      const response = await this.aiService.askAdvisor(body.question, financialSummary, user?.hfToken);
      return { response };
    } catch (error) {
      return { response: `Lo siento, hubo un error procesando tu reporte financiero: ${error.message}` };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.financesService.remove(id, req.user);
  }
}
