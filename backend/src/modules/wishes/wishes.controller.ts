import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WishesService } from './wishes.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/user.decorator';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UserAuthPayloadDto } from '../auth/dto/user-auth-payload-dto';
import { ApiExceptionDto } from '../../common/dto/api-exception-dto';
import { plainToInstance } from 'class-transformer';
import { WishResponseDto } from './dto/wish-response.dto';

@ApiTags('wishes')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: ApiExceptionDto })
@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiBadRequestResponse({ type: ApiExceptionDto })
  @Post()
  create(
    @Body() createWishDto: CreateWishDto,
    @CurrentUser() user: UserAuthPayloadDto,
  ) {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @ApiNotFoundResponse({ type: ApiExceptionDto })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = this.wishesService.findOne(+id);
    if (!result) {
      throw new NotFoundException(`Wish with ${id} does not exist.`);
    }
    return plainToInstance(WishResponseDto, result);
  }

  @ApiBadRequestResponse({ type: ApiExceptionDto })
  @ApiForbiddenResponse({ type: ApiExceptionDto })
  @ApiNotFoundResponse({ type: ApiExceptionDto })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @CurrentUser() user: UserAuthPayloadDto,
  ) {
    const result = await this.wishesService.findOne(id);
    if (!result) {
      throw new NotFoundException(`Wish with ${id} does not exist.`);
    }
    if (result.owner.id !== user.id) {
      throw new ForbiddenException('Permission error');
    }
    // disable change price if offers > 0
    if (result.offers.length > 0) {
      updateWishDto.price = undefined;
    }
    return this.wishesService.update(+id, updateWishDto);
  }

  @ApiNotFoundResponse({ type: ApiExceptionDto })
  @ApiForbiddenResponse({ type: ApiExceptionDto })
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: UserAuthPayloadDto,
  ) {
    const result = await this.wishesService.findOne(id);
    if (!result) {
      throw new NotFoundException(`Wish with ${id} does not exist.`);
    }
    if (result.owner.id !== user.id) {
      throw new ForbiddenException('Permission error');
    }
    return this.wishesService.remove(+id);
  }

  @ApiNotFoundResponse({ type: ApiExceptionDto })
  @Post(':id/copy')
  async copy(@Param('id') id: number, @CurrentUser() user: UserAuthPayloadDto) {
    const result = this.wishesService.copy(id, user);
    if (!result) {
      throw new NotFoundException(`Wish with ${id} does not exist.`);
    }
    return plainToInstance(WishResponseDto, result);
  }
}
