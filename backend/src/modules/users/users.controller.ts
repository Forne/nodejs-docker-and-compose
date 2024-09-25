import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/user.decorator';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserProfileWishesResponseDto } from './dto/user-profile-wishes-response.dto';
import { WishResponseDto } from '../wishes/dto/wish-response.dto';
import { UserAuthPayloadDto } from '../auth/dto/user-auth-payload-dto';
import { ApiExceptionDto } from '../../common/dto/api-exception-dto';

@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: ApiExceptionDto })
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findOwnProfile(
    @CurrentUser() currentUser: UserAuthPayloadDto,
  ): Promise<UserProfileResponseDto> {
    const result = await this.usersService.findOneById(currentUser.id);
    if (!result) {
      throw new NotFoundException(
        `User with ${currentUser.id} does not exist.`,
      );
    }
    return plainToInstance(UserProfileResponseDto, result);
  }

  @ApiBadRequestResponse()
  @Patch('me')
  async updateOwnProfile(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserAuthPayloadDto,
  ) {
    const result = await this.usersService.update(
      currentUser.id,
      updateUserDto,
    );
    return plainToInstance(UserProfileResponseDto, result);
  }

  @Get('me/wishes')
  async findOwnWishes(
    @CurrentUser() currentUser: UserAuthPayloadDto,
  ): Promise<WishResponseDto[]> {
    const user = await this.usersService.findWishesByUserId(currentUser.id);
    if (!user) {
      throw new NotFoundException(
        `User with ${currentUser.id} does not exist.`,
      );
    }
    return plainToInstance(UserProfileWishesResponseDto, user).wishes;
  }

  @ApiNotFoundResponse()
  @Get(':username')
  async findUser(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const result = await this.usersService.findOneByUsername(username);
    if (!result) {
      throw new NotFoundException(`User ${username} does not exist.`);
    }
    return plainToInstance(UserPublicProfileResponseDto, result);
  }

  @ApiNotFoundResponse()
  @Get(':username/wishes')
  async findUserWishes(
    @Param('username') username: string,
  ): Promise<WishResponseDto[]> {
    const user = await this.usersService.findWishesByUsername(username);
    if (!user) {
      throw new NotFoundException(`User ${username} does not exist.`);
    }
    return plainToInstance(UserProfileWishesResponseDto, user).wishes;
  }

  @ApiOkResponse({
    /* тип UserPublicProfileResponseDto более подходящий
     * если скрывать email от других юзеров, то везде */
    type: UserPublicProfileResponseDto,
    isArray: true,
  })
  @Post('find')
  findUsersByQuery(@Body() findUsersDto: FindUsersDto) {
    const result = this.usersService.findByQuery(findUsersDto.query);
    return plainToInstance(UserPublicProfileResponseDto, result);
  }
}
