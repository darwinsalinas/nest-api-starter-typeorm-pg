import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { UserRoleGuard } from '../guards/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { JwtAuthGuard } from '../guards/auth.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(JwtAuthGuard, UserRoleGuard),
  );
}
