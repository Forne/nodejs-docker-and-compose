import { ApiProperty } from '@nestjs/swagger';
import { Offer } from '../../offers/entities/offer.entity';
import { CoreEntity } from '../../../common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsUrl, Length, Min } from 'class-validator';
import { Expose } from 'class-transformer';

@Entity('wishes')
export class Wish extends CoreEntity {
  @Expose()
  @ApiProperty({
    description: 'Wish title',
    example: 'iPhone 16',
  })
  @Length(1, 250)
  @Column()
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Link to shop',
    example: 'https://market.yandex.ru/',
  })
  @IsUrl()
  @Column()
  link: string;

  @Expose()
  @ApiProperty({
    description: 'Link to image',
    example: 'https://market.example/1.jpg',
  })
  @IsUrl()
  @Column()
  image: string;

  @Expose()
  @ApiProperty({
    description: 'Price of item',
    example: 100,
  })
  @Min(1)
  @Column()
  price: number;

  @Expose()
  @ApiProperty()
  @Column({
    default: 0,
  })
  raised: number;

  @Expose()
  @ApiProperty()
  @Column({
    default: 0,
  })
  copied: number;

  @Expose()
  @ApiProperty({
    description: 'Briefly about item',
    example: 'lorem...',
  })
  @Length(1, 1024)
  @Column()
  description: string;

  @Expose()
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ApiProperty()
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
