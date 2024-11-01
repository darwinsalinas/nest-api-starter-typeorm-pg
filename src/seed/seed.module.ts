import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, CompaniesModule],
})
export class SeedModule {}
