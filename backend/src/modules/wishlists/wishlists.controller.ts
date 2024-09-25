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
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/user.decorator';
import { ApiExceptionDto } from '../../common/dto/api-exception-dto';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { UserAuthPayloadDto } from '../auth/dto/user-auth-payload-dto';

@ApiTags('wishlists')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: ApiExceptionDto })
@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiBadRequestResponse({ type: ApiExceptionDto })
  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @CurrentUser() user: UserAuthPayloadDto,
  ) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @ApiNotFoundResponse({ type: ApiExceptionDto })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(+id);
  }

  @ApiBadRequestResponse({ type: ApiExceptionDto })
  @ApiForbiddenResponse({ type: ApiExceptionDto })
  @ApiNotFoundResponse({ type: ApiExceptionDto })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @CurrentUser() user: UserAuthPayloadDto,
  ) {
    const result = await this.wishlistsService.findOne(id);
    if (!result) {
      throw new NotFoundException(`Wishlist with ${id} does not exist.`);
    }
    if (result.owner.id !== user.id) {
      throw new ForbiddenException('Permission error');
    }
    return this.wishlistsService.update(id, updateWishlistDto);
  }

  @ApiForbiddenResponse({ type: ApiExceptionDto })
  @ApiNotFoundResponse({ type: ApiExceptionDto })
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: UserAuthPayloadDto,
  ) {
    const result = await this.wishlistsService.findOne(id);
    if (!result) {
      throw new NotFoundException(`Wishlist with ${id} does not exist.`);
    }
    if (result.owner.id !== user.id) {
      throw new ForbiddenException('Permission error');
    }
    return this.wishlistsService.remove(id);
  }
}
