import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  me() {
    // Since we are not protecting this route, we can create a dummy user
    const user = new User();

    user.email = 'cashier@gmail.com';
    // This is the user id that we will use to query the user from the database
    user.id = 'eb1f4884-3436-4e9f-ad0c-6b4c35a5129a';

    return this.authService.me(user);
  }
}
