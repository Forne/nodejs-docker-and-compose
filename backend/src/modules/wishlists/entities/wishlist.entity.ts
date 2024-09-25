import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { IsUrl, Length } from 'class-validator';
import { CoreEntity } from '../../../common/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity('wishlists')
export class Wishlist extends CoreEntity {
  @Expose()
  @ApiProperty()
  @Length(1, 250)
  @Column()
  name: string;

  @Expose()
  @ApiProperty()
  @IsUrl()
  @Column()
  image: string;

  @Expose()
  @ApiProperty()
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @Expose()
  @ApiProperty()
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
