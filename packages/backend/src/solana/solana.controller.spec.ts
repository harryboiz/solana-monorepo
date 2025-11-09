import { Test, TestingModule } from '@nestjs/testing';
import { SolanaController } from './solana.controller';
import { SolanaService } from './solana.service';

describe('SolanaController', () => {
    let controller: SolanaController;

    const mockSolanaService = {
        getTransactionCount: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SolanaController],
            providers: [
                {
                    provide: SolanaService,
                    useValue: mockSolanaService,
                },
            ],
        }).compile();

        controller = module.get<SolanaController>(SolanaController);
    });

    it('should return correct tx count format', async () => {
        mockSolanaService.getTransactionCount.mockResolvedValue(123);

        const result = await controller.getBlockTxCount("1000");

        expect(mockSolanaService.getTransactionCount).toHaveBeenCalledWith(1000);
        expect(result).toEqual({
            block: 1000,
            transactionCount: 123,
        });
    });
});
