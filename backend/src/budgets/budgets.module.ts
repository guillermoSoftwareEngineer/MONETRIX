import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { Budget } from './entities/budget.entity';
import { Finance } from '../finances/entities/finance.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Budget, Finance])],
    providers: [BudgetsService],
    controllers: [BudgetsController],
    exports: [BudgetsService],
})
export class BudgetsModule { }
