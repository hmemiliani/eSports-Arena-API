import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validar usuario por username y password
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid username or password');
  }

  // Login: Retornar JWT al usuario
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
