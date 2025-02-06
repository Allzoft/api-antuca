import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient();
      return client.handshake;  
    }
    return context.switchToHttp().getRequest();
  }
}
