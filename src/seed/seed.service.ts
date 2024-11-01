import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, Role, Permission } from '../auth/entities';
import { initialData } from './data/seed-data';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
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
    await this.companyRepository.delete({});
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const company = this.companyRepository.create({
      name: 'Company',
      ruc: '123456789',
    });

    await this.companyRepository.save(company);

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
          company,
          permissions: [],
        }),
      );
    }

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }
}
