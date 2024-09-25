import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserDto extends IntersectionType(
  PickType(User, ['username', 'email', 'password']),
  PartialType(PickType(User, ['about', 'avatar'])),
) {}
