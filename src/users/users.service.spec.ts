import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateUserRequestDto, CreateUserResponseDto } from './users.dto';

const mockUsersRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    const createUserDto: CreateUserRequestDto = {
      email: 'test@example.com',
      marketingData: { subscribe: true },
    };

    it('should create and return a user successfully', async () => {
      const savedUser = {
        id: 1,
        email: 'test@example.com',
      } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(savedUser);

      const result: CreateUserResponseDto =
        await service.createUser(createUserDto);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
      });

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });

      expect(usersRepository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if the user already exists', async () => {
      const existingUser = { id: 1, email: 'test@example.com' } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(existingUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException('Unable to create user'),
      );

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });

      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should log a warning if the user already exists', async () => {
      const loggerSpy = jest.spyOn(service['logger'], 'warn');
      const existingUser = { id: 1, email: 'test@example.com' } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(existingUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException('Unable to create user'),
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        'user with email:test@example.com already exists',
      );
    });

    it('should log success message when user is created', async () => {
      const loggerSpy = jest.spyOn(service['logger'], 'log');
      const savedUser = { id: 1, email: 'test@example.com' } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(savedUser);

      await service.createUser(createUserDto);

      expect(loggerSpy).toHaveBeenCalledWith('user created successfully');
    });
  });
});
