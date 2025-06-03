import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './songs.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [SongsController],
  providers: [SongsService],
  imports: [
    TypeOrmModule.forFeature([Song]),
    CloudinaryModule,
    JwtModule,
    UsersModule,
  ],
  exports: [SongsService],
})
export class SongModule {}
