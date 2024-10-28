import { Query, Resolver } from "@nestjs/graphql";


@Resolver()
export class AuthResolver {

    @Query(() => String)
    authState(): string {
        return 'Authenticated???';
    }
}