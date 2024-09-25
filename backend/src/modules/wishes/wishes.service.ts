import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UserAuthPayloadDto } from '../auth/dto/user-auth-payload-dto';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,

    @InjectRepository(Wish)
    private userRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: UserAuthPayloadDto) {
    const wish = this.wishRepository.create(createWishDto);
    wish.owner = await this.userRepository.findOneBy({ id: owner.id });
    return this.wishRepository.save(wish).then((res) => {
      res.owner = null;
      return res;
    });
  }

  findLast() {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      // cache: 60000,
    });
  }

  findTop() {
    return this.wishRepository.find({
      order: { copied: 'ASC' },
      take: 20,
      // cache: 60000,
    });
  }

  findOne(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: { user: true } },
    });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    this.wishRepository.update({ id }, updateWishDto).then(() => {
      return this.wishRepository.findOneBy({ id });
    });
  }

  remove(id: number) {
    return this.wishRepository.delete({ id });
  }

  async copy(id: number, user: UserAuthPayloadDto) {
    const result = await this.findOne(id);
    console.log(result);
    if (!result) {
      return null;
    }
    // TODO transaction
    result.copied += 1;
    await this.wishRepository.save(result);

    const copy = plainToInstance(CreateWishDto, result, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
    return this.create(copy, user);

    // this.findOne(id)
    //   .then((wish) => {
    //     console.log(wish);
    //     if (!wish) {
    //       throw new Error('Not found');
    //     }
    //     return wish;
    //   })
    //   .then((wish) => {
    //     wish.copied += 1;
    //     return this.wishRepository.save(wish);
    //   })
    //   .then((wish) => {
    //     const copy = plainToInstance(CreateWishDto, wish);
    //     return this.create(copy, user);
    //   });
  }
}
