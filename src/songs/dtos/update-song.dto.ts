import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  artist?: string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  releasedDate?: Date;

  @IsString()
  @IsOptional()
  @IsOptional()
  lyrics?: string;
}
