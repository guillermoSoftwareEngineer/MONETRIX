import { MailService } from './mail.service';
import { ReminderService } from './reminder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Finance } from '../finances/entities/finance.entity';
import { Module, Global } from '@nestjs/common'; // This import was missing in the provided "Code Edit" but is necessary and present in the original. I'm adding it back.

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User, Finance])],
    providers: [MailService, ReminderService],
    exports: [MailService],
})
export class MailModule { }
