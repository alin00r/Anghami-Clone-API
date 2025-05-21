import { Module } from '@nestjs/common';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { UsersModule } from 'src/users/users.module';
import { GoogleOauthService } from './google-oauth.service';

@Module({
  imports: [UsersModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy, GoogleOauthService],
  exports: [],
})
export class GoogleOauthModule {}
