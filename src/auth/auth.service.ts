import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';

import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { validatePassword, hashPassword, handleError } from '../common/helpers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { password } = registerUserDto;

    const hash = await hashPassword(password);

    const user = this.userRepository.create({
      ...registerUserDto,
      password: hash,
    });

    try {
      await this.userRepository.save(user);
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
      select: ['id', 'email', 'password', 'roles', 'directPermissions'],
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
      select: ['id', 'email', 'password', 'roles', 'directPermissions'],
      relations: ['roles.permissions', 'directPermissions'],
    });

    return {
      ...dbUser,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }
}
