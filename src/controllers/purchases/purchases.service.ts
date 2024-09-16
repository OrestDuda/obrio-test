import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Purchase } from 'entities/purchase.entity';
import { User } from 'entities/user.entity';
import { Offer } from 'entities/offer.entity';
import {
  ANALYTICS_REPORT_DELAY,
  ANALYTICS_REPORT_JOB_NAME,
  ANALYTICS_REPORT_QUEUE_NAME,
  ASTROLOGY_REPORT_DELAY,
  ASTROLOGY_REPORT_JOB_NAME,
  ASTROLOGY_REPORT_QUEUE_NAME,
} from 'processors/queue.constants';
import {
  CreatePurchaseRequestDto,
  CreatePurchaseResponseDto,
} from 'controllers/purchases/purchases.dto';

@Injectable()
export class PurchasesService {
  private readonly logger = new Logger(PurchasesService.name);

  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectQueue(ASTROLOGY_REPORT_QUEUE_NAME)
    private readonly astrologyReportQueue: Queue,
    @InjectQueue(ANALYTICS_REPORT_QUEUE_NAME)
    private readonly analyticsReportQueue: Queue,
  ) {}

  async createPurchase(
    createPurchaseDto: CreatePurchaseRequestDto,
  ): Promise<CreatePurchaseResponseDto> {
    const { userId, offerId } = createPurchaseDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`user not found, userId:${userId}`);
      throw new BadRequestException('User not found');
    }

    const offer = await this.offersRepository.findOne({
      where: { id: offerId },
    });
    if (!offer) {
      this.logger.error(`offer not found, offerId:${offerId}`);
      throw new BadRequestException('Offer not found');
    }

    const purchase = this.purchasesRepository.create({ user, offer });
    const savedPurchase = await this.purchasesRepository.save(purchase);

    this.logger.log(`purchase created successfully`);

    await Promise.all([
      this.analyticsReportQueue.add(
        ANALYTICS_REPORT_JOB_NAME,
        { userId, offerId },
        { delay: ANALYTICS_REPORT_DELAY },
      ),
      this.astrologyReportQueue.add(
        ASTROLOGY_REPORT_JOB_NAME,
        { userId, offerId },
        { delay: ASTROLOGY_REPORT_DELAY },
      ),
    ]);

    return {
      id: savedPurchase.id,
      userId: savedPurchase.user.id,
      offerId: savedPurchase.offer.id,
    };
  }
}
