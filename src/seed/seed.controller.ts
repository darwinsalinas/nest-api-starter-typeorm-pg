import { Controller, Get } from '@nestjs/common';
// import { Auth } from 'src/auth/decorators';
// import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
