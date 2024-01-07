import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from '../common/requestWithUser';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  // @Post('/login')
  // async loginUser(loginUserDto: LoginUserDto) {
  //   const user = await this.authService.loginUser(loginUserDto);
  //   const token = await this.authService.generateAccessToken(user.id);
  //   return { user, token };
  // }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Req() req: RequestWithUser) {
    const { user } = req;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @Post('email/send')
  async emailSender(@Body('email') email: string) {
    return await this.authService.emailSend(email);
  }

  @Post('email/check')
  async emailCheckSender(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    return await this.authService.emailCheck(email, code);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googlecallback(@Req() req: RequestWithUser) {
    const { user } = req;
    return user;
  }
}
