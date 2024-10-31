import { Controller, Post, Body, Get, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDTO: RegisterUserDto) {
    return this.authService.register(registerDTO);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDTO: LoginUserDto) {
    return this.authService.login(loginDTO);
  }

  @Get('me')
  @Auth()
  me(@GetUser() user: User) {
    return this.authService.me(user);
  }

  @Get('me/pdf')
  @Auth()
  mePDF(@GetUser() user: User, @Res() response: Response) {
    const pdfDoc = this.authService.mePdf(user);

    response.setHeader('Content-Type', 'application/pdf');

    pdfDoc.info.Title = 'Me';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
