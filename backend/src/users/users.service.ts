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

    async updateSettings(id: string, settings: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, settings);
        const updated = await this.findOne(id);
        if (!updated) throw new Error('User not found after update');
        return updated;
    }

    async addXp(id: string, amount: number): Promise<{ user: User, leveledUp: boolean }> {
        const user = await this.findOne(id);
        if (!user) throw new Error('User not found');

        let leveledUp = false;
        user.xp += amount;

        // Level Up Logic: Each level requires level * 100 XP
        const xpNeeded = user.level * 100;
        if (user.xp >= xpNeeded) {
            user.level += 1;
            user.xp -= xpNeeded;
            leveledUp = true;
        }

        const savedUser = await this.usersRepository.save(user);
        return { user: savedUser, leveledUp };
    }
}
