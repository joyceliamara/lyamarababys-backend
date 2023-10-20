import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not exists');
    }

    let user = null;

    try {
      const payload = verify(token, process.env.JWT_KEY);

      const userId = payload['id'];

      user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('User is not admin');
    }

    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
