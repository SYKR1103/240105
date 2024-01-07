import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ProviderEnum } from '../../user/entities/provider.enum';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENTID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { name, email } = profile._json;
    const { provider } = profile;

    try {
      const user = await this.userService.findUserByEmail(email);
      if (user.provider !== 'local') throw new InternalServerErrorException();
      done(null, user);
    } catch (e) {
      console.log(e);
      if (e.status === 404 || undefined) {
        const newuser = await this.userService.createUser({
          nickname: name,
          email,
          provider: ProviderEnum.Google,
        });
        done(null, newuser);
      }
    }
  }
}
