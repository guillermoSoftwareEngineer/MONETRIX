import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FinanceType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    INVESTMENT = 'INVESTMENT',
}

@Entity()
export class Finance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ length: 255 })
    description: string;

    @Column({
        type: 'enum',
        enum: FinanceType,
    })
    type: FinanceType;

    @Column({ nullable: true })
    category: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ default: 'COP' })
    currency: string; // 'COP', 'USD', 'EUR'

    @Column('decimal', { precision: 12, scale: 2, nullable: true })
    originalAmount: number;

    @Column('decimal', { precision: 12, scale: 6, default: 1 })
    exchangeRate: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    interestRate: number; // For investments

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.finances)
    user: User;
}
