import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Finance } from '../../finances/entities/finance.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    fullName: string;

    @OneToMany(() => Finance, (finance) => finance.user)
    finances: Finance[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: 'monthly' })
    reminderFrequency: string; // 'monthly', 'quincenal', 'none'

    @Column({ default: 1 })
    reminderDay: number; // 1-31

    @Column({ default: '09:00' })
    reminderTime: string; // HH:mm

    @Column({ default: true })
    investmentsReminder: boolean;

    @Column({ default: 1 })
    level: number;

    @Column({ default: 0 })
    xp: number;

    @Column({ type: 'text', nullable: true, default: '[]' })
    medals: string; // JSON string array of medal IDs

    @Column({ nullable: true, select: false })
    hfToken: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    emergencyFundGoal: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    savingsGoal: number;

    @Column({ default: 'monthly' })
    savingsFrequency: string; // 'monthly', 'quincenal'
}
