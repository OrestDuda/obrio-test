import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from 'entities/offer.entity';
import {
  CreateOfferRequestDto,
  CreateOfferResponseDto,
} from 'offers/offers.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  async createOffer(
    createOfferDto: CreateOfferRequestDto,
  ): Promise<CreateOfferResponseDto> {
    const savedOffer = await this.offersRepository.save(createOfferDto);
    return {
      id: savedOffer.id,
      name: savedOffer.name,
      price: savedOffer.price,
    };
  }
}
