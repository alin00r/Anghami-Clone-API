import { Song } from './songs.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSongDTO } from './dtos/create-song.dto';
import { convertDurationToMinutes } from 'src/utils/turnDuration';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
    private cloudinary: CloudinaryService,
  ) {}

  public async uploadImageToCloudinary(file: Express.Multer.File) {
    const result = await this.cloudinary.uploadImage(file).catch((err) => {
      throw new BadRequestException('Invalid image file type.');
    });
    return result.secure_url;
  }

  public async uploadAudioToCloudinary(file: Express.Multer.File) {
    const result = await this.cloudinary.uploadAudio(file).catch((err) => {
      throw new BadRequestException('Invalid audio file type.');
    });
    return result;
  }

  public async createSong(dto: CreateSongDTO) {
    const newSong = this.songsRepository.create({
      ...dto,
      name: dto.name.toLowerCase(),
    });

    return this.songsRepository.save(newSong);
  }

  public async getAll(name?: string, artist?: string): Promise<Song[]> {
    const filters = {
      ...(name ? { name: Like(`%${name}%`) } : {}),
      ...(artist ? { artist: Like(`%${artist}%`) } : {}),
    };
    return this.songsRepository.find({
      where: filters,
    });
  }

  public async getOneBy(id: number) {
    const song = await this.songsRepository.findOne({
      where: { id },
    });
    console.log(song);
    if (!song) throw new NotFoundException('song not found');
    return song;
  }

  public async deleteOne(id: number) {
    const song = await this.getOneBy(id);
    if (!song) throw new NotFoundException('song not found');
    await this.songsRepository.remove(song);
    return { message: 'Product deleted successfully' };
  }
}
