import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from './purchases.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from 'entities/purchase.entity';
import { User } from 'entities/user.entity';
import { Offer } from 'entities/offer.entity';
import { BadRequestException } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  CreatePurchaseRequestDto,
  CreatePurchaseResponseDto,
} from 'purchases/purchases.dto';
import {
  ANALYTICS_REPORT_JOB_NAME,
  ASTROLOGY_REPORT_JOB_NAME,
  ANALYTICS_REPORT_QUEUE_NAME,
  ASTROLOGY_REPORT_QUEUE_NAME,
  ANALYTICS_REPORT_DELAY,
  ASTROLOGY_REPORT_DELAY,
} from 'processors/queue.constants';

const mockPurchasesRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

const mockUsersRepository = () => ({
  findOne: jest.fn(),
});

const mockOffersRepository = () => ({
  findOne: jest.fn(),
});

const mockQueue = () => ({
  add: jest.fn(),
});

describe('PurchasesService', () => {
  let service: PurchasesService;
  let purchasesRepository: Repository<Purchase>;
  let usersRepository: Repository<User>;
  let offersRepository: Repository<Offer>;
  let astrologyReportQueue: Queue;
  let analyticsReportQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchasesService,
        {
          provide: getRepositoryToken(Purchase),
          useFactory: mockPurchasesRepository,
        },
        { provide: getRepositoryToken(User), useFactory: mockUsersRepository },
        {
          provide: getRepositoryToken(Offer),
          useFactory: mockOffersRepository,
        },
        {
          provide: `BullQueue_${ASTROLOGY_REPORT_QUEUE_NAME}`,
          useFactory: mockQueue,
        },
        {
          provide: `BullQueue_${ANALYTICS_REPORT_QUEUE_NAME}`,
          useFactory: mockQueue,
        },
      ],
    }).compile();

    service = module.get<PurchasesService>(PurchasesService);
    purchasesRepository = module.get<Repository<Purchase>>(
      getRepositoryToken(Purchase),
    );
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    offersRepository = module.get<Repository<Offer>>(getRepositoryToken(Offer));
    astrologyReportQueue = module.get<Queue>(
      `BullQueue_${ASTROLOGY_REPORT_QUEUE_NAME}`,
    );
    analyticsReportQueue = module.get<Queue>(
      `BullQueue_${ANALYTICS_REPORT_QUEUE_NAME}`,
    );
  });

  describe('createPurchase', () => {
    const createPurchaseDto: CreatePurchaseRequestDto = {
      userId: 1,
      offerId: 1,
    };

    it('should create and return the purchase successfully', async () => {
      const user = { id: 1 } as User;
      const offer = { id: 1 } as Offer;
      const purchase = { id: 1, user, offer } as Purchase;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(offersRepository, 'findOne').mockResolvedValue(offer);
      jest.spyOn(purchasesRepository, 'create').mockReturnValue(purchase);
      jest.spyOn(purchasesRepository, 'save').mockResolvedValue(purchase);

      const result: CreatePurchaseResponseDto =
        await service.createPurchase(createPurchaseDto);

      expect(result).toEqual({
        id: 1,
        userId: 1,
        offerId: 1,
      });

      expect(purchasesRepository.create).toHaveBeenCalledWith({ user, offer });
      expect(purchasesRepository.save).toHaveBeenCalledWith(purchase);

      expect(astrologyReportQueue.add).toHaveBeenCalledWith(
        ASTROLOGY_REPORT_JOB_NAME,
        { userId: 1, offerId: 1 },
        { delay: ASTROLOGY_REPORT_DELAY },
      );

      expect(analyticsReportQueue.add).toHaveBeenCalledWith(
        ANALYTICS_REPORT_JOB_NAME,
        { userId: 1, offerId: 1 },
        { delay: ANALYTICS_REPORT_DELAY },
      );
    });

    it('should throw an error if the user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createPurchase(createPurchaseDto)).rejects.toThrow(
        new BadRequestException('User not found'),
      );

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: createPurchaseDto.userId },
      });
    });

    it('should throw an error if the offer is not found', async () => {
      const user = { id: 1 } as User;
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(offersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createPurchase(createPurchaseDto)).rejects.toThrow(
        new BadRequestException('Offer not found'),
      );

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: createPurchaseDto.userId },
      });
      expect(offersRepository.findOne).toHaveBeenCalledWith({
        where: { id: createPurchaseDto.offerId },
      });
    });

    it('should log an error if the user is not found', async () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createPurchase(createPurchaseDto)).rejects.toThrow(
        new BadRequestException('User not found'),
      );

      expect(loggerSpy).toHaveBeenCalledWith('user not found, userId:1');
    });

    it('should log an error if the offer is not found', async () => {
      const user = { id: 1 } as User;
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(offersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createPurchase(createPurchaseDto)).rejects.toThrow(
        new BadRequestException('Offer not found'),
      );

      expect(loggerSpy).toHaveBeenCalledWith('offer not found, offerId:1');
    });
  });
});
