import { Body, Req, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { SigninUserDto } from './dto/signin-user';
import { ApiExceptionDto } from '../../common/dto/api-exception-dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserResponseDto } from './dto/signin-user-response';
import { SignupUserResponseDto } from './dto/signup-user-response';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SigninUserDto })
  @ApiCreatedResponse({ type: SigninUserResponseDto })
  @ApiBadRequestResponse({ type: ApiExceptionDto })
  @ApiUnauthorizedResponse({ type: ApiExceptionDto })
  @UseGuards(LocalGuard)
  @Post('signin')
  signIn(@Req() req): SigninUserResponseDto {
    const result = this.authService.auth(req.user);
    return plainToInstance(SigninUserResponseDto, result);
  }

  @ApiCreatedResponse({ type: SignupUserResponseDto })
  @ApiBadRequestResponse({ type: ApiExceptionDto })
  @ApiConflictResponse({ type: ApiExceptionDto })
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): SignupUserResponseDto {
    const result = this.authService.register(createUserDto);
    return plainToInstance(SignupUserResponseDto, result);
  }
}
