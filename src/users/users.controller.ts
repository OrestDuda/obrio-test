import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { CreateUserRequestDto, CreateUserResponseDto } from 'users/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return await this.usersService.createUser(createUserDto);
  }
}
