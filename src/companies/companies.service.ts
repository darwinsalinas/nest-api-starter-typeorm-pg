import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create(createCompanyDto);

    return this.companyRepository.save(company);
  }

  findOne(id: string) {
    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.users', 'user')
      .where('company.id = :id', { id })
      .getOne();
  }
}
