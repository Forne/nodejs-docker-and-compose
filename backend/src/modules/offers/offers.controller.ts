import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Offer } from './entities/offer.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/user.decorator';
import { ApiExceptionDto } from '../../common/dto/api-exception-dto';
import { UserAuthPayloadDto } from '../auth/dto/user-auth-payload-dto';

@ApiTags('offers')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: ApiExceptionDto })
@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiBadRequestResponse({ type: ApiExceptionDto })
  @Post()
  create(
    @Body() createOfferDto: CreateOfferDto,
    @CurrentUser() user: UserAuthPayloadDto,
  ) {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@Param('id') id: number) {
    const offer = this.offersService.findOne(id);
    if (!offer) {
      throw new NotFoundException(`Offer with ${id} does not exist.`);
    }
    return plainToInstance(Offer, offer);
  }
}
