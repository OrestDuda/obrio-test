import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { User } from 'entities/user.entity';
import { Offer } from 'entities/offer.entity';
import { Purchase } from 'entities/purchase.entity';
import { UsersModule } from 'users/users.module';
import { PurchasesModule } from 'purchases/purchases.module';
import { OffersModule } from 'offers/offers.module';
import { AstrologyReportProcessor } from 'processors/astrology-report.processor';
import { AnalyticsReportProcessor } from 'processors/analytics-report.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Offer, Purchase],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    OffersModule,
    PurchasesModule,
  ],
  controllers: [],
  providers: [AstrologyReportProcessor, AnalyticsReportProcessor],
})
export class AppModule {}
