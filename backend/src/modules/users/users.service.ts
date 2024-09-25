import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy([
      { email: createUserDto.email },
      { username: createUserDto.username },
    ]);
    if (existingUser.email == createUserDto.email) {
      throw new BadRequestException('Email already exists');
    } else if (existingUser.username == createUserDto.username) {
      throw new BadRequestException('Username already exists');
    }

    const user = await this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findOneById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOneBy([
        { email: updateUserDto.email },
        { username: updateUserDto.username },
      ]);
      if (existingUser && existingUser.id !== id) {
        if (existingUser.email == updateUserDto.email) {
          throw new BadRequestException('Email already exists');
        } else if (existingUser.username == updateUserDto.username) {
          throw new BadRequestException('Username already exists');
        }
      }
    }

    // Select, update and return all fields in one query
    const userRow = await this.userRepository
      .createQueryBuilder()
      .update(User, updateUserDto)
      .where('id = :id', { id })
      .returning('*')
      .updateEntity(true)
      .execute();

    if (userRow.affected == 1 && userRow.raw.length > 0) {
      return userRow.raw[0] as UserProfileResponseDto;
    }
    return null;
    // const find = await this.userRepository.findOneBy({ id });
    // if (updateUserDto.password) {
    //   updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    // }
    // return this.userRepository.save({ ...find, ...updateUserDto });
  }

  findWishesByUserId(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
  }

  findWishesByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
  }

  findByQuery(query: string) {
    return this.userRepository.findBy([{ email: query }, { username: query }]);
  }
}
