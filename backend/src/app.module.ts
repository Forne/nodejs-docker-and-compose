import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OffersModule } from './modules/offers/offers.module';
import { WishesModule } from './modules/wishes/wishes.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { User } from './modules/users/entities/user.entity';
import { Wish } from './modules/wishes/entities/wish.entity';
import { Offer } from './modules/offers/entities/offer.entity';
import { Wishlist } from './modules/wishlists/entities/wishlist.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: null,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database.url'),
        entities: [User, Wish, Offer, Wishlist],
        //migrations: ['src/database/migrations/*.ts'],
        synchronize: true,
        //autoLoadModels: true,
        logging: true,
      }),
    }),
    UsersModule,
    AuthModule,
    OffersModule,
    WishesModule,
    WishlistsModule,
  ],
  providers: [],
})
export class AppModule {}
