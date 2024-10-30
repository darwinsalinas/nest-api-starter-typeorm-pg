import { ContextType, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    if (context.getType() === ('graphql' as ContextType)) {
      const ctx = GqlExecutionContext.create(context);

      return ctx.getContext().req;
    }

    return context.switchToHttp().getRequest();
  }
}
