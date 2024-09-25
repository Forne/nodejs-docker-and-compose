import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { SigninUserResponseDto } from './dto/signin-user-response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return null;
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (isPasswordMatching) {
      return user;
    }
    return null;
  }

  auth(user: User): SigninUserResponseDto {
    const payload = { id: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
    createdUser.password = undefined;
    return createdUser;
  }
}
