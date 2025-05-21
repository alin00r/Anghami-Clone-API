import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from 'src/users/auth.provider';
import { GoogleOauthService } from './google-oauth.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly googleOauthService: GoogleOauthService,
    private readonly authProvider: AuthProvider,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const user = await this.googleOauthService.handleGoogleLogin(profile);
    const accessToken = await this.authProvider.generateJWT({
      id: user.id,
      userType: user.userType,
    });

    return { accessToken };
  }
}
