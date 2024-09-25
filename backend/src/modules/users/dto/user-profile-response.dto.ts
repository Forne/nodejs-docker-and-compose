import { Expose } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserProfileResponseDto extends PickType(User, [
  'id',
  'username',
  'about',
  'avatar',
  'email',
  'createdAt',
  'updatedAt',
]) {
  @Expose()
  email: string;
}
