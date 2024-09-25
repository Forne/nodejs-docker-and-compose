import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { UserAuthPayloadDto } from '../auth/dto/user-auth-payload-dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,

    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: UserAuthPayloadDto,
  ) {
    const wishlist = this.wishlistRepository.create(createWishlistDto);
    wishlist.owner = await this.userRepository.findOneBy({ id: owner.id });
    wishlist.items = await this.wishRepository.findBy({
      id: In(createWishlistDto.itemsId),
    });
    return this.wishlistRepository.save(wishlist);
  }

  findAll() {
    return this.wishlistRepository.find({});
  }

  findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    let items;
    if (updateWishlistDto.itemsId) {
      items = await this.wishRepository.findBy({
        id: In(updateWishlistDto.itemsId),
      });
    }

    return this.wishlistRepository
      .update({ id }, { ...updateWishlistDto, items })
      .then(() => this.wishlistRepository.findOneBy({ id }));
  }

  remove(id: number) {
    return this.wishlistRepository.delete({ id });
  }
}
