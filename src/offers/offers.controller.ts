import { Controller, Post, Body } from '@nestjs/common';
import { OffersService } from 'offers/offers.service';
import {
  CreateOfferRequestDto,
  CreateOfferResponseDto,
} from 'offers/offers.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferRequestDto,
  ): Promise<CreateOfferResponseDto> {
    return await this.offersService.createOffer(createOfferDto);
  }
}
