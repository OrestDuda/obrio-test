import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from 'entities/offer.entity';
import { OffersService } from 'offers/offers.service';
import { OffersController } from 'offers/offers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
