import { Controller, Post, Body } from '@nestjs/common';
import { PurchasesService } from 'purchases/purchases.service';
import {
  CreatePurchaseRequestDto,
  CreatePurchaseResponseDto,
} from 'purchases/purchases.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  async createPurchase(
    @Body() createPurchaseDto: CreatePurchaseRequestDto,
  ): Promise<CreatePurchaseResponseDto> {
    return this.purchasesService.createPurchase(createPurchaseDto);
  }
}
