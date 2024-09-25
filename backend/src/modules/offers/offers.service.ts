import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UserAuthPayloadDto } from '../auth/dto/user-auth-payload-dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,

    @InjectRepository(Offer)
    private wishRepository: Repository<Wish>,

    @InjectRepository(Offer)
    private userRepository: Repository<User>,
  ) {}

  async create(createOfferDto: CreateOfferDto, owner: UserAuthPayloadDto) {
    const offer = this.offerRepository.create(createOfferDto);

    const wish = await this.wishRepository.findOneBy({
      id: createOfferDto.itemId,
    });
    if (owner.id === wish.owner.id) {
      throw new BadRequestException(
        'You cannot create a offer for your own wish.',
      );
    }
    offer.item = wish;
    offer.user = await this.userRepository.findOneBy({ id: owner.id });

    if (wish.raised === wish.price) {
      throw new BadRequestException(
        'Amount for the gift has already been raised',
      );
    } else if (wish.raised + offer.amount > wish.price) {
      throw new BadRequestException(
        'Amount is more than required for the gift',
      );
    }

    await this.wishRepository.update(
      { id: wish.id },
      { raised: wish.raised + offer.amount },
    );

    return this.offerRepository.save(offer).then((res) => {
      res.user = null;
      return res;
    });
  }

  findAll() {
    return this.offerRepository.find({});
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
