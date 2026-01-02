import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    getProfile(@Request() req) {
        return this.usersService.getUserWithApiKey(req.user.userId);
    }

    @Patch('settings')
    updateSettings(@Request() req, @Body() settings: Partial<User>) {
        return this.usersService.updateSettings(req.user.userId, settings);
    }
}
