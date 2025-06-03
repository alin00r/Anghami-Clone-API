import { Song } from './songs.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSongDTO } from './dtos/create-song.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersService } from 'src/users/users.service';
import { UpdateSongDTO } from './dtos/update-song.dto';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
    private cloudinary: CloudinaryService,
    private usersService: UsersService,
  ) {}

  public async uploadImageToCloudinary(file: Express.Multer.File) {
    const result = await this.cloudinary.uploadImage(file).catch((err) => {
      console.log(err);
      throw new BadRequestException('Cloudinary image upload error.');
    });
    return result.secure_url;
  }

  public async uploadAudioToCloudinary(file: Express.Multer.File) {
    const result = await this.cloudinary.uploadAudio(file).catch((err) => {
      throw new BadRequestException('Cloudinary audio upload error.');
    });
    return result;
  }

  public async createSong(dto: CreateSongDTO, userId: number) {
    const user = await this.usersService.getCurrentUser(userId);
    console.log(user.songs);
    const newSong = this.songsRepository.create({
      ...dto,
      name: dto.name.toLowerCase(),
      user,
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
    return { message: 'Song deleted successfully' };
  }

  public async update(id: number, dto: UpdateSongDTO) {
    const song = await this.getOneBy(id);
    song.name = dto.name ?? song.name; // -> coalescing operator
    song.artist = dto.artist ?? song.artist;
    song.releasedDate = dto.releasedDate ?? song.releasedDate;
    song.releasedDate = dto.releasedDate ?? song.releasedDate;
    return this.songsRepository.save(song);
  }

  public async updateSongImage(songId: number, newSongImage: string) {
    const song = await this.getOneBy(songId);
    if (song.imageUrl === null) {
      song.imageUrl = newSongImage;
    } else {
      const cloudinaryBublicId = this.cloudinary.getPublicIdFromUrl(
        song.imageUrl.toString(),
      );
      await this.cloudinary.deleteImagefromCloudinary(await cloudinaryBublicId);
      song.imageUrl = newSongImage;
    }

    return this.songsRepository.save(song);
  }

  public async updateSongAudio(songId: number, newSongAudio: string) {
    const song = await this.getOneBy(songId);
    if (song.imageUrl === null) {
      song.audioUrl = newSongAudio;
    } else {
      const cloudinaryBublicId = this.cloudinary.getPublicIdFromUrl(
        song.imageUrl.toString(),
      );
      await this.cloudinary.deleteImagefromCloudinary(await cloudinaryBublicId);
      song.audioUrl = newSongAudio;
    }

    return this.songsRepository.save(song);
  }
}
