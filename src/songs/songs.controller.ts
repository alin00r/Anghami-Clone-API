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
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dtos/create-song.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('api/songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (
          file.fieldname === 'image' &&
          !file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)
        ) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }

        if (
          file.fieldname === 'audio' &&
          !file.mimetype.match(/^audio\/(mp3|mpeg|wav)$/)
        ) {
          return cb(
            new BadRequestException('Only audio files are allowed!'),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async createNewSong(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() songData: Omit<CreateSongDTO, 'imageUrl' | 'audioUrl' | 'duration'>,
  ) {
    const imageFile = files.find((file) => file.mimetype.startsWith('image/'));
    const audioFile = files.find((file) => file.mimetype.startsWith('audio/'));

    if (!imageFile || !audioFile) {
      throw new BadRequestException('Image and audio files are required');
    }

    try {
      const imageUrl =
        await this.songsService.uploadImageToCloudinary(imageFile);
      const audioResult =
        await this.songsService.uploadAudioToCloudinary(audioFile);

      console.log(audioResult);
      return await this.songsService.createSong({
        ...songData,
        imageUrl,
        audioUrl: audioResult.url,
        duration: audioResult.duration,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      throw new InternalServerErrorException(
        'Failed to upload media or create song',
      );
    }
  }

  @Get()
  public getAllsongs(
    @Query('name') name?: string,
    @Query('artist') artist?: string,
  ) {
    return this.songsService.getAll(name, artist);
  }

  @Get('/:id')
  public getSingleSong(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.getOneBy(id);
  }

  @Delete('/:id')
  public deleteSong(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.deleteOne(id);
  }
}
