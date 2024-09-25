import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { TypeORMMySqlTestingModule } from '../../common/test-utils/TypeORMPgSqlTestingModule';

describe('OffersService', () => {
  let service: OffersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeORMMySqlTestingModule([Offer, Wish, User]),
        TypeOrmModule.forFeature([Offer, Wish, User]),
      ],
      providers: [OffersService],
    }).compile();

    service = module.get<OffersService>(OffersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
