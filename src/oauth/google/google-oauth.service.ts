import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { Profile } from 'passport-google-oauth20';
import { AuthProvider } from 'src/users/auth.provider';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/utils/enums';

@Injectable()
export class GoogleOauthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authProvider: AuthProvider,
  ) {}
  async handleGoogleLogin(profile: Profile): Promise<User> {
    const { name, emails, photos } = profile;
    const email = emails[0].value;

    let user = await this.usersService.findByEmail(email);
    if (user) return user;

    const randomPassword = randomBytes(32).toString('hex');
    const hashedPassword = await this.authProvider.hashPassword(randomPassword);

    const randomSuffix = randomBytes(3).toString('hex');
    const baseName = `${name.givenName}${name.familyName || ''}`
      .toLowerCase()
      .replace(/\s+/g, '');
    const generatedUsername = `${baseName}-${randomSuffix}`;

    user = await this.usersService.create({
      username: generatedUsername,
      email,
      password: hashedPassword,
      userType: UserType.NORMAL_USER,
      isAccountVerified: true,
      kind: 'google',
      profileImage: photos?.[0]?.value || null,
    });

    await this.authProvider.setPasswordLink(email);
    return user;
  }
}
