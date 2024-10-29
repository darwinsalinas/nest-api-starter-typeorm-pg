import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../auth/entities/user.entity';
import { META_ROLES } from '../decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    return this.validateRequest(context, validRoles);
  }

  async validateRequest(
    execContext: ExecutionContext,
    validRoles: string[],
  ): Promise<boolean> {
    const request = execContext.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new BadRequestException('User not found in request');
    }

    const dbUser = await this.userRepository.findOne({
      where: {
        email: user.email,
        isActive: true,
      },
      select: ['id', 'email', 'password', 'roles', 'directPermissions'],
      relations: ['roles.permissions', 'directPermissions'],
    });

    if (!dbUser) {
      throw new BadRequestException('User is not active or does not exist');
    }

    for (const role of dbUser.roles) {
      if (validRoles.includes(role.role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User does not have the required role [${validRoles}]`,
    );
  }
}
