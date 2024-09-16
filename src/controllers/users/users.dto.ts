import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  marketingData?: any;
}

export class CreateUserResponseDto {
  id: number;
  email: string;
}
