import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterGoogleDto {
  providerid: string;
  provider: string;
  @IsEmail()
  @MaxLength(250)
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @Length(2, 150)
  @ApiPropertyOptional()
  username: string;

  @IsOptional()
  @IsString()
  password: string;
}
