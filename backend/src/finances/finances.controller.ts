import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('finances')
@UseGuards(JwtAuthGuard)
export class FinancesController {
  constructor(private readonly financesService: FinancesService) { }

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

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.financesService.remove(id, req.user);
  }
}
