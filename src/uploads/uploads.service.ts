import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(private cloudinary: CloudinaryService) {}

  public async uploadImageToCloudinary(file: Express.Multer.File) {
    const result = await this.cloudinary.uploadImage(file).catch((err) => {
      console.log(err);
      throw new BadRequestException('Invalid file type.');
    });

    return result.secure_url;
  }

  public async uploadAudioToCloudinary(file: Express.Multer.File) {
    const result = await this.cloudinary.uploadAudio(file).catch((err) => {
      throw new BadRequestException('Invalid audio file type.');
    });
    return result;
  }
}
