import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SigninUserResponseDto {
  @Expose()
  @ApiProperty()
  access_token: string;
}
