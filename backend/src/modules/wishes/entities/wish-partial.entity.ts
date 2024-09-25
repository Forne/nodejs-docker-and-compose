import { OmitType } from '@nestjs/mapped-types';
import { Wish } from './wish.entity';

export class WishPartial extends OmitType(Wish, ['owner', 'offers']) {}
