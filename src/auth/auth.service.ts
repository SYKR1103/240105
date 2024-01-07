import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TokenInterface } from '../common/Token.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);
    if (!newUser) throw new HttpException('not found', HttpStatus.NOT_FOUND);
    return newUser;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);
    const isMatched = await user.checkPassword(loginUserDto.password);
    if (!isMatched) throw new HttpException('xxxx', HttpStatus.NOT_FOUND);
    return user;
  }
  public generateAccessToken(userId: string) {
    const payload: TokenInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }

  async emailSend(email: string) {
    const verification_code = this.generate_OTP();
    await this.cacheManager.set(email, verification_code);
    await this.emailService.sendMail({
      to: email,
      subject: 'verification code is ',
      text: `verification code is ${verification_code}`,
    });
    return 'success';
  }

  async emailCheck(email: string, code: string) {
    const re = await this.cacheManager.get(email);
    if (re !== code) throw new InternalServerErrorException();
    await this.cacheManager.del(email);
    return true;
  }

  generate_OTP() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.ceil(Math.random() * 10);
    }
    return OTP;
  }
}
