import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {

    const user = await this.usersService.findOne(email, password);

    if (user && user.inactive) {

      //await this.usersService.requestEnableUser(user);

      throw new UnauthorizedException(`Account is disabled`)
    }

    return user;
  }

  async login(user: any) {
    try {
      const userDetails = await this.validateUser(user.email, user.password);
      const payload = { email: user.email, sub: userDetails.id, role: userDetails.role };
      return {
        ...payload,
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
