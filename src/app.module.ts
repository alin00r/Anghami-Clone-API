import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SongModule } from './songs/songs.module';
import { Song } from './songs/songs.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadModule } from './uploads/uploads.module';
import { User } from './users/entities/user.entity';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { GoogleOauthModule } from './oauth/google/google-oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('NEON_DB_HOST'),
          port: config.get<number>('NEON_DB_PORT'),
          username: config.get<string>('NEON_DB_USERNAME'),
          password: config.get<string>('NEON_DB_BASSWORD'),
          database: 'Anghami_Clone_API',
          ssl: {
            rejectUnauthorized: false,
          },
          synchronize: process.env.NODE_ENV !== 'production',
          entities: [Song, User],
        };
      },
    }),
    SongModule,
    UsersModule,
    CloudinaryModule,
    UploadModule,
    MailModule,
    GoogleOauthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
