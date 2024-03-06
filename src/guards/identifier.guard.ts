import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class IdentifierGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token'] ?? request.headers['authorization'];

    if (!token) {
      request['user'] = undefined;

      return true;
    }

    let user = undefined;

    try {
      const payload = verify(token, process.env.JWT_KEY);

      user = payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
