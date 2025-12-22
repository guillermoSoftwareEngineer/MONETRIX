import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        console.log(`[AUTH DEBUG] Validating user: ${email}`);
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            console.log(`[AUTH DEBUG] User not found: ${email}`);
            return null;
        }

        console.log(`[AUTH DEBUG] User found. ID: ${user.id}. Comparing passwords...`);
        const isMatch = await bcrypt.compare(pass, user.password);
        console.log(`[AUTH DEBUG] Password match: ${isMatch}`);

        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        const { password, ...result } = user;
        return {
            user: result,
        };
    }
}
