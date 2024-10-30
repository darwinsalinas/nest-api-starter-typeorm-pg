import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../entities';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  let user: User;

  if (ctx.getType() === 'http') {
    user = ctx.switchToHttp().getRequest().user;
  } else {
    user = GqlExecutionContext.create(ctx).getContext().req.user;
  }

  if (!user) {
    throw new InternalServerErrorException(
      'User not found in request, not authenticated',
    );
  }

  if (data) {
    return user[data];
  }

  return user;
});
