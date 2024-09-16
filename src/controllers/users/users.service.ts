import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from 'controllers/users/users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(
    createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const { email } = createUserDto;
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn(`user with email:${email} already exists`);
      throw new BadRequestException('Unable to create user');
    }
    const savedUser = await this.usersRepository.save(createUserDto);
    this.logger.log('user created successfully');
    return {
      id: savedUser.id,
      email: savedUser.email,
    };
  }
}
