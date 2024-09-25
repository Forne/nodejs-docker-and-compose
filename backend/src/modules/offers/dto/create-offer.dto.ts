import { ApiProperty, PickType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';
import { Expose } from 'class-transformer';

export class CreateOfferDto extends PickType(Offer, ['amount', 'hidden']) {
  @Expose()
  @ApiProperty()
  itemId: number;
}
