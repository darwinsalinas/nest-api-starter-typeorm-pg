import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @Auth()
  me(@GetUser() user: User) {
    return this.authService.me(user);
  }
}
