import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './uploads.service';
import { memoryStorage } from 'multer';

@Controller('/api/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadService.uploadImageToCloudinary(file);
    return { url: response };
  }
  @Post('audio')
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadService.uploadAudioToCloudinary(file);
    return { url: response };
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    try {
      const imageUrls = await Promise.all(
        files.map((file) => this.uploadService.uploadImageToCloudinary(file)),
      );
      return { imageUrls: imageUrls };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to process images or create product',
      );
    }
  }
}
