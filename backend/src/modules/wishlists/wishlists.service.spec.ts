import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsService } from './wishlists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { TypeORMMySqlTestingModule } from '../../common/test-utils/TypeORMPgSqlTestingModule';

describe('WishlistsService', () => {
  let service: WishlistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeORMMySqlTestingModule([Wishlist, Wish, User]),
        TypeOrmModule.forFeature([Wishlist, Wish, User]),
      ],
      providers: [WishlistsService],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
