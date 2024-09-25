import { Test, TestingModule } from '@nestjs/testing';
import { WishesService } from './wishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { TypeORMMySqlTestingModule } from '../../common/test-utils/TypeORMPgSqlTestingModule';

describe('WishesService', () => {
  let service: WishesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeORMMySqlTestingModule([Wish, User]),
        TypeOrmModule.forFeature([Wish, User]),
      ],
      providers: [WishesService],
    }).compile();

    service = module.get<WishesService>(WishesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
