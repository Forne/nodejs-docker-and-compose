import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from '../../../common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Expose } from 'class-transformer';

@Entity('users')
export class User extends CoreEntity {
  @Expose()
  @ApiProperty({
    description: 'Username',
    example: 'elonmusk',
  })
  @Length(2, 30)
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'qwerty123!!!',
  })
  @Column()
  password: string;

  @Expose()
  @ApiProperty({
    description: 'Briefly about myself',
    example: 'something about me...',
  })
  @Length(0, 200)
  @Column()
  about: string;

  @Expose()
  @ApiProperty({
    description: 'Link to user avatar',
    example: 'https://i.pravatar.cc/150?img=',
  })
  @IsUrl()
  @Column()
  avatar: string;

  @ApiProperty({
    description: 'User email',
    example: 'admin@x.com',
  })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ApiProperty()
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @ApiProperty()
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
