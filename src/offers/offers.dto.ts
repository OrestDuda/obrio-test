import { IsString, IsNotEmpty, IsDecimal, IsPositive } from 'class-validator';

export class CreateOfferRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  price: number;
}

export class CreateOfferResponseDto {
  id: number;
  name: string;
  price: number;
}
