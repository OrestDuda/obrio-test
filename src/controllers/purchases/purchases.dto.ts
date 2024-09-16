import { IsInt, IsPositive } from 'class-validator';

export class CreatePurchaseRequestDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsPositive()
  offerId: number;
}

export class CreatePurchaseResponseDto {
  id: number;
  userId: number;
  offerId: number;
}
