import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from 'entities/offer.entity';
import { OffersService } from 'controllers/offers/offers.service';
import { OffersController } from 'controllers/offers/offers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
