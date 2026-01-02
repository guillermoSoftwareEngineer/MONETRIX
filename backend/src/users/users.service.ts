import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { password, ...rest } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
        });

        return this.usersRepository.save(user);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async getUserWithApiKey(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            select: ['id', 'fullName', 'email', 'level', 'xp', 'hfToken', 'reminderFrequency', 'reminderDay', 'reminderTime', 'investmentsReminder', 'emergencyFundGoal', 'savingsGoal', 'savingsFrequency']
        });
    }

    async updateSettings(id: string, settings: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, settings);
        const updated = await this.getUserWithApiKey(id);
        if (!updated) throw new Error('User not found after update');
        return updated;
    }

    async updateXp(id: string, amount: number): Promise<{ user: User, leveledUp: boolean, levelDown: boolean }> {
        const user = await this.findOne(id);
        if (!user) throw new Error('User not found');

        let leveledUp = false;
        let levelDown = false;

        user.xp += amount;

        // XP Scaling: 1000 XP per level (Compatible with 1000 levels progression)
        const XP_PER_LEVEL = 1000;

        // Level Up logic
        if (user.xp >= XP_PER_LEVEL) {
            if (user.level < 1000) {
                user.level += 1;
                user.xp -= XP_PER_LEVEL;
                leveledUp = true;
            } else {
                user.xp = XP_PER_LEVEL; // Cap at max
            }
        }

        // Level Down logic
        if (user.xp < 0) {
            if (user.level > 1) {
                user.level -= 1;
                user.xp = XP_PER_LEVEL + user.xp; // Add the negative XP to the base of previous level
                levelDown = true;
            } else {
                user.xp = 0; // Floor at level 1, 0 XP
            }
        }

        const savedUser = await this.usersRepository.save(user);
        return { user: savedUser, leveledUp, levelDown };
    }

    // Keep addXp as an alias or update callers
    async addXp(id: string, amount: number) {
        return this.updateXp(id, amount);
    }
}
