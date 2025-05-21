import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  artist: string;

  @IsNotEmpty()
  @IsDateString()
  releasedDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  lyrics: string;

  @IsString()
  audioUrl: String;

  @IsString()
  @IsOptional()
  imageUrl: String;
}
