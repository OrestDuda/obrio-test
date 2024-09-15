import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Purchase } from 'entities/purchase.entity';
import { User } from 'entities/user.entity';
import { Offer } from 'entities/offer.entity';
import { PurchasesController } from 'purchases/purchases.controller';
import { PurchasesService } from 'purchases/purchases.service';
import {
  ANALYTICS_REPORT_QUEUE_NAME,
  ASTROLOGY_REPORT_QUEUE_NAME,
} from 'processors/queue.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, User, Offer]),
    HttpModule,
    BullModule.registerQueue({
      name: ASTROLOGY_REPORT_QUEUE_NAME,
    }),
    BullModule.registerQueue({
      name: ANALYTICS_REPORT_QUEUE_NAME,
    }),
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
