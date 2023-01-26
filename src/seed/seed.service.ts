import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../auth/entities/user.entity';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async executeSeed() {
    await this.deleteTables();
    await this.insertUsers();

    return `Seed executed`;
  }

  private async deleteTables() {
    await this.userRepository.delete({});
  }

  private async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    });

    const dbUsers = await this.userRepository.save(seedUsers)

    return dbUsers[0];
  }
}
