import { Controller, Post, Body } from '@nestjs/common';
import { PurchasesService } from 'controllers/purchases/purchases.service';
import {
  CreatePurchaseRequestDto,
  CreatePurchaseResponseDto,
} from 'controllers/purchases/purchases.dto';

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
