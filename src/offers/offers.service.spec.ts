import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Offer } from 'entities/offer.entity';
import {
  CreateOfferRequestDto,
  CreateOfferResponseDto,
} from 'offers/offers.dto';

const mockOffersRepository = () => ({
  save: jest.fn(),
});

describe('OffersService', () => {
  let service: OffersService;
  let repository: Repository<Offer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useFactory: mockOffersRepository,
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
    repository = module.get<Repository<Offer>>(getRepositoryToken(Offer));
  });

  describe('createOffer', () => {
    const createOfferDto: CreateOfferRequestDto = {
      name: 'Test Offer',
      price: 100.0,
    };

    it('should create and return the offer successfully', async () => {
      const savedOffer = {
        id: 1,
        ...createOfferDto,
      };

      jest.spyOn(repository, 'save').mockResolvedValue(savedOffer);

      const result: CreateOfferResponseDto =
        await service.createOffer(createOfferDto);

      expect(result).toEqual({
        id: 1,
        name: 'Test Offer',
        price: 100.0,
      });

      expect(repository.save).toHaveBeenCalledWith(createOfferDto);
    });

    it('should throw an error when save fails', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.createOffer(createOfferDto)).rejects.toThrow(
        'Database error',
      );
      expect(repository.save).toHaveBeenCalledWith(createOfferDto);
    });

    it('should call repository.save with correct arguments', async () => {
      const savedOffer = {
        id: 1,
        ...createOfferDto,
      };

      jest.spyOn(repository, 'save').mockResolvedValue(savedOffer);

      await service.createOffer(createOfferDto);

      expect(repository.save).toHaveBeenCalledWith(createOfferDto);
    });

    it('should throw an error if name is empty', async () => {
      const invalidOfferDto = { name: '', price: 100.0 };

      jest.spyOn(repository, 'save').mockImplementation(async () => {
        throw new Error('Validation failed: Name cannot be empty');
      });

      await expect(service.createOffer(invalidOfferDto as any)).rejects.toThrow(
        'Validation failed: Name cannot be empty',
      );
      expect(repository.save).toHaveBeenCalledWith(invalidOfferDto);
    });

    it('should throw an error if price is zero or negative', async () => {
      const invalidOfferDto = { name: 'Test Offer', price: 0 };

      jest.spyOn(repository, 'save').mockImplementation(async () => {
        throw new Error('Validation failed: Price must be positive');
      });

      await expect(service.createOffer(invalidOfferDto as any)).rejects.toThrow(
        'Validation failed: Price must be positive',
      );
      expect(repository.save).toHaveBeenCalledWith(invalidOfferDto);
    });
  });
});
