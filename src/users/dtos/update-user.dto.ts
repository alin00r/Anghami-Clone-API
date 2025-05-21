import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @MaxLength(250)
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsString()
  @Length(2, 150)
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;
}
