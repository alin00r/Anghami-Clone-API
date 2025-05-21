import { Module } from '@nestjs/common';

import { UploadController } from './uploads.controller';
import { UploadService } from './uploads.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [CloudinaryModule],
  exports: [UploadService],
})
export class UploadModule {}
