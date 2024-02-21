import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies['token'] ?? request.headers['authorization'];

    if (!token) {
      return false;
    }

    try {
      const user = this.jwtService.verify(token);

      request.user = user;

      return true;
    } catch (error) {
      return false;
    }
  }
}
