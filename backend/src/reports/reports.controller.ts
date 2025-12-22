import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FinancesService } from '../finances/finances.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as express from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
        private readonly financesService: FinancesService,
        private readonly usersService: UsersService,
    ) { }

    @Get('monthly')
    async getMonthlyReport(@Request() req, @Res() res: express.Response) {
        const userId = req.user.userId;
        const user = await this.usersService.findOne(userId);
        const finances = await this.financesService.findAll({ id: userId });

        if (!user) throw new Error('User not found');

        const buffer = await this.reportsService.generateMonthlyReport(user, finances);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=reporte-monedix.pdf',
            'Content-Length': buffer.length,
        });

        res.end(buffer);
    }
}
