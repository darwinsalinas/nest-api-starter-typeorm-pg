import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';

import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { validatePassword, hashPassword, handleError } from '../common/helpers';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from 'src/printer/printer.service';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: JwtService,
    private readonly printerService: PrinterService,
  ) {}

  async register(registerDTO: RegisterUserDto) {
    const { password } = registerDTO;

    const hash = await hashPassword(password);

    const user = this.userRepository.create({
      ...registerDTO,
      password: hash,
    });

    const company = this.companyRepository.create({
      name: `${registerDTO.fullName} Company`,
      ruc: '123456789',
    });

    try {
      await this.userRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(company);
          user.company = company;
          await transactionalEntityManager.save(user);
        },
      );

      delete user.password;
      delete user.company;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
        isActive: true,
      },
      select: [
        'id',
        'email',
        'fullName',
        'password',
        'roles',
        'directPermissions',
      ],
      relations: ['roles.permissions', 'directPermissions'],
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await validatePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async me(user: User) {
    const dbUser = await this.userRepository.findOne({
      where: {
        email: user.email,
        isActive: true,
      },
      select: [
        'id',
        'email',
        'password',
        'roles',
        'directPermissions',
        'fullName',
      ],
      relations: ['roles.permissions', 'directPermissions'],
    });

    delete dbUser.password;

    return {
      ...dbUser,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  mePdf(user: User) {
    const docDefinition: TDocumentDefinitions = {
      content: [`Hello ${user.email}`],
    };

    const doc = this.printerService.createPdf(docDefinition);

    return doc;
  }
}
