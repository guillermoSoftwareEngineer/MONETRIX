import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { FinanceType } from '../entities/finance.entity';

export class CreateFinanceDto {
    @IsNumber()
    @Min(0)
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(FinanceType)
    type: FinanceType;

    @IsString()
    @IsOptional()
    category?: string;

    @IsOptional()
    date?: Date;

    @IsNumber()
    @IsOptional()
    interestRate?: number;

    @IsOptional()
    startDate?: Date;

    @IsOptional()
    endDate?: Date;
}
