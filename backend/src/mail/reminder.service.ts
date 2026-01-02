import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Finance, FinanceType } from '../finances/entities/finance.entity';
import { MailService } from './mail.service';

@Injectable()
export class ReminderService {
    private readonly logger = new Logger(ReminderService.name);

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Finance)
        private financesRepository: Repository<Finance>,
        private mailService: MailService,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        this.logger.debug('Checking for reminders...');
        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, '0');
        const currentMinute = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;
        const currentDay = now.getDate();

        // 1. Periodic Reminders (Monthly/Quincenal)
        const users = await this.usersRepository.find({
            where: [
                { reminderFrequency: 'monthly', reminderDay: currentDay },
                // Simplified quincenal: day X and day X+15 (mod 30)
                { reminderFrequency: 'quincenal', reminderDay: currentDay },
            ],
        });

        for (const user of users) {
            if (user.reminderTime === currentTime) {
                await this.mailService.sendReminderEmail(user.email, user.fullName || 'Usuario', user.reminderFrequency as any);
            }
        }

        // 2. Investment Expiration Alerts (Tomorrow)
        // Runs once a day at a fixed time (e.g., 08:00) to avoid duplicates
        if (currentTime === '08:00') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const dayAfterTomorrow = new Date(tomorrow);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

            const investments = await this.financesRepository.find({
                where: {
                    type: FinanceType.INVESTMENT,
                    endDate: Between(tomorrow, dayAfterTomorrow),
                },
                relations: ['user']
            });

            for (const inv of investments) {
                if (inv.user && inv.user.investmentsReminder) {
                    await this.mailService.sendInvestmentAlert(
                        inv.user.email,
                        inv.user.fullName || 'Usuario',
                        inv.description,
                        inv.endDate.toLocaleDateString()
                    );
                }
            }
        }
    }
}
