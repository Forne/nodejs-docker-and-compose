import { ApiProperty, PickType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';

export class CreateWishlistDto extends PickType(Wishlist, ['name', 'image']) {
  @ApiProperty()
  itemsId: number[];
}
