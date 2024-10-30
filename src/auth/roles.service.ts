import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async find({ role }: Pick<Role, 'role'>) {
    return this.roleRepo.find({ where: { role }, relations: ['permissions'] });
  }

  async findOne(id: string) {
    return this.roleRepo.findOne({ where: { id }, relations: ['permissions'] });
  }
}
