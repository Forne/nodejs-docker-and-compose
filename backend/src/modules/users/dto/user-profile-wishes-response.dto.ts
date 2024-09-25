import { Expose, Type } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { WishResponseDto } from '../../wishes/dto/wish-response.dto';

export class UserProfileWishesResponseDto extends PickType(User, ['wishes']) {
  @ApiProperty({
    type: WishResponseDto,
  })
  @Type(() => WishResponseDto)
  @Expose()
  wishes: Wish[];
}
