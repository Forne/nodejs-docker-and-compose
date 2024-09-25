import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserPublicProfileResponseDto extends PickType(User, [
  'id',
  'username',
  'about',
  'avatar',
  'createdAt',
  'updatedAt',
]) {}
