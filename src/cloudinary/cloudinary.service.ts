import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  public async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'user-profile' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result as any);
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(upload);
    });
  }

  public async uploadImages(images: string[]): Promise<string[]> {
    const uploadPromises = images.map(async (imageUrl) => {
      const response = await fetch(imageUrl);
      const buffer = Buffer.from(await response.arrayBuffer());

      return new Promise<string>((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          { folder: 'songs' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              return reject(error);
            }
            resolve(result?.secure_url || '');
          },
        );

        const stream = Readable.from(buffer);
        stream.pipe(upload);
      });
    });

    return Promise.all(uploadPromises);
  }

  public async uploadBuffer(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'songs' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result?.secure_url || '');
        },
      );

      const stream = Readable.from(buffer);
      stream.pipe(upload);
    });
  }

  public async uploadAudio(
    file: Express.Multer.File,
  ): Promise<{ url: string; duration: number }> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'songs',
          resource_type: 'video',
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary audio upload error:', error);
            return reject(error);
          }

          const url = result?.secure_url ?? '';
          const duration = result?.duration ?? 0;

          resolve({ url, duration });
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }

  public async deleteImage(publicId: string): Promise<any> {
    return await v2.uploader.destroy(publicId);
  }

  public async uploadImageToCloudinary(file: Express.Multer.File) {
    const result = await this.uploadImage(file).catch((err) => {
      throw new BadRequestException('Invalid image file type.');
    });
    return result.secure_url;
  }

  /**
   * Delete image from cloudinary
   */
  public async deleteImagefromCloudinary(id: string) {
    await this.deleteImage(id).catch((err) => {
      throw new BadRequestException('Image not found on server');
    });
  }

  /**
   * Returns the cloudinary public id of image url
   */
  public async getPublicIdFromUrl(url: string): Promise<string> {
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split('/');
      const filenameWithExt = parts.pop(); // e.g., "my-image_12345.png"
      const folderPath = parts.slice(3).join('/'); // e.g., "user_images"

      const filename = filenameWithExt?.split('.').slice(0, -1).join('.') || '';

      return `${folderPath}/${filename}`;
    } catch (error) {
      throw new Error('Invalid Cloudinary URL');
    }
  }
}
