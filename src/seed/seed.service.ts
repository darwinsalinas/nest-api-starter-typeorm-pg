import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, Role, Permission } from '../auth/entities';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async executeSeed() {
    await this.deleteTables();
    await this.insertUsers();

    return `Seed executed`;
  }

  private async deleteTables() {
    await this.userRepository.delete({});
    await this.roleRepository.delete({});
    await this.permissionRepository.delete({});
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    for (const user of seedUsers) {
      const role = this.roleRepository.create({ role: user.roles[0] });
      await this.roleRepository.save(role);

      const permission = this.permissionRepository.create({
        permission: user.permissions[0],
      });

      await this.permissionRepository.save(permission);

      users.push(
        this.userRepository.create({
          ...user,
          roles: [role],
          directPermissions: [permission],
          permissions: [],
        }),
      );
    }

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }
}
