import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enums/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers['authorization'];

    if (!requiredRoles) {
      return true;
    }
    const token = authorization.split(' ')[1];
    const decoded = this.decodeJwt(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    const userRole = decoded.role;
    return requiredRoles.some((role) => userRole === role);
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
  }
}
