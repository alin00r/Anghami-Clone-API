// src/common/interceptors/media-upload.interceptor.ts

import {
  BadRequestException,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export function UploadMediaFilesInterceptor() {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'image', maxCount: 1 },
          { name: 'audio', maxCount: 1 },
        ],
        {
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
        },
      ),
    ),
  );
}
