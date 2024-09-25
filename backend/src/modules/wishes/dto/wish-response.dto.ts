import { PickType } from '@nestjs/swagger';
import { Wish } from '../entities/wish.entity';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { User } from '../../users/entities/user.entity';
import { Expose, Type } from 'class-transformer';
import { Offer } from '../../offers/entities/offer.entity';

export class WishResponseDto extends PickType(Wish, [
  'id',
  'name',
  'link',
  'image',
  'price',
  'raised',
  'copied',
  'description',
  'owner',
  'offers',
  'createdAt',
  'updatedAt',
]) {
  @Type(() => UserPublicProfileResponseDto)
  @Expose()
  owner: User;

  @Type(() => Offer)
  @Expose()
  offers: Offer[];
}
