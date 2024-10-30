import { Args, Query, Resolver } from '@nestjs/graphql';
import { Role } from './entities';
import { RolesService } from './roles.service';
import { Auth } from './decorators';

@Resolver()
@Auth()
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => [Role])
  find(@Args('role') role: string) {
    return this.rolesService.find({ role });
  }
}
