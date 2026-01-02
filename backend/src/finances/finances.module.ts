import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancesService } from './finances.service';
import { AIService } from './ai.service';
import { FinancesController } from './finances.controller';
import { Finance } from './entities/finance.entity';
import { UsersModule } from '../users/users.module';
import { BudgetsModule } from '../budgets/budgets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Finance]),
    UsersModule,
    BudgetsModule
  ],
  controllers: [FinancesController],
  providers: [FinancesService, AIService],
  exports: [FinancesService, AIService]
})
export class FinancesModule { }
