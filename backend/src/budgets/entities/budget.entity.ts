import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    category: string;

    @Column('decimal', { precision: 12, scale: 2 })
    limit: number;

    @ManyToOne(() => User, (user) => user.id)
    user: User;
}
