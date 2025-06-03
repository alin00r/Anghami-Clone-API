import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dtos/create-song.dto';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayloadType } from 'src/utils/types';
import { UploadMediaFilesInterceptor } from './interceptors/upload.interceptor';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { UpdateSongDTO } from './dtos/update-song.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('api/songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // POST: ~/api/songs/
  @Post()
  @Roles(UserType.ADMIN || UserType.ARTIST || UserType.MODERATOR)
  @UseGuards(AuthRolesGuard)
  @UploadMediaFilesInterceptor()
  async createNewSong(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      audio?: Express.Multer.File[];
    },
    @Body() songData: Omit<CreateSongDTO, 'imageUrl' | 'audioUrl' | 'duration'>,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    const imageFile = files.image?.[0];
    const audioFile = files.audio?.[0];

    if (!imageFile || !audioFile) {
      throw new BadRequestException('Image and audio files are required');
    }

    try {
      const imageUrl =
        await this.songsService.uploadImageToCloudinary(imageFile);
      const audioResult =
        await this.songsService.uploadAudioToCloudinary(audioFile);

      return await this.songsService.createSong(
        {
          ...songData,
          imageUrl,
          audioUrl: audioResult.url,
          duration: audioResult.duration,
        },
        payload.id,
      );
    } catch (error) {
      console.error('Upload failed:', error);
      throw new InternalServerErrorException(
        'Failed to upload media or create song',
      );
    }
  }

  // GET: ~/api/songs/
  @Get()
  @UseGuards(AuthGuard)
  public getAllsongs(
    @Query('name') name?: string,
    @Query('artist') artist?: string,
  ) {
    return this.songsService.getAll(name, artist);
  }

  // GET: ~/api/songs/:id
  @Get('/:id')
  public getSingleSong(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.getOneBy(id);
  }

  // DELETE: ~/api/songs/:id
  @Delete('/:id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public deleteSong(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.deleteOne(id);
  }

  // PATCH: ~api/songs/:id
  @Patch('/:id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public updateSong(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSongDTO,
  ) {
    return this.songsService.update(id, body);
  }

  // PATCH: ~api/songs/:id/update-song-image
  @Patch('/:id/update-song-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('song-image'))
  public async updateSongImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = await this.cloudinary.uploadImageToCloudinary(file);
    return this.songsService.updateSongImage(id, imageUrl);
  }

  // PATCH: ~api/songs/:id/update-song-audio
  @Patch('/:id/update-song-audio')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('song-audio'))
  public async updateSongAudio(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const audioUrl = await this.cloudinary.uploadAudio(file);
    return this.songsService.updateSongAudio(id, audioUrl.url);
  }
}
