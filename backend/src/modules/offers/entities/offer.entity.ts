import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { CoreEntity } from '../../../common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import { Min } from 'class-validator';

@Entity('offers')
export class Offer extends CoreEntity {
  @ApiProperty()
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish; // ManyToOne

  @Expose()
  @ApiProperty({
    description: 'Amount',
    example: 100,
  })
  @Min(1)
  @Column()
  amount: number;

  @Expose()
  @ApiProperty({
    description: 'Hide order from list',
    example: true,
    default: false,
  })
  @Column()
  hidden: boolean;

  @Expose()
  @ApiProperty()
  // Hide user details if offer is hidden
  @Transform(({ value, obj }) => {
    if (!obj.hidden) return value;
  })
  @ManyToOne(() => User, (user) => user.offers)
  user: User; // ManyToOne
}
