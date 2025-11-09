import { SolanaService } from './solana.service';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import type { Cache } from 'cache-manager';

jest.mock('@solana/web3.js', () => ({
    Connection: jest.fn().mockImplementation(() => ({
        getBlock: jest.fn(),
    })),
    clusterApiUrl: jest.fn().mockReturnValue('https://mock-rpc/'),
}));

const mockCache: Cache = {
    get: jest.fn().mockResolvedValue(undefined),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
    reset: jest.fn().mockResolvedValue(undefined),
} as any;

describe('SolanaService (RPC + Cache)', () => {
    let service: SolanaService;
    let connection: any;

    beforeEach(() => {
        jest.clearAllMocks();
        connection = new Connection(clusterApiUrl('mainnet-beta'));
        service = new SolanaService(mockCache);
        // Override connection với mock
        (service as any).connection = connection;
    });

    it('should return cached value if available', async () => {
        (mockCache.get as jest.Mock).mockResolvedValue(7);

        const count = await service.getTransactionCount(123);
        expect(count).toBe(7);
        expect(mockCache.get).toHaveBeenCalledWith('block-123');
        expect(connection.getBlock).not.toHaveBeenCalled();
        expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('should call RPC and set cache if not cached', async () => {
        (mockCache.get as jest.Mock).mockResolvedValue(undefined);
        connection.getBlock.mockResolvedValue({
            transactions: [1, 2],
            maxSupportedTransactionVersion: 0,
        });

        const count = await service.getTransactionCount(200);

        expect(count).toBe(2);
        expect(connection.getBlock).toHaveBeenCalledWith(200, { maxSupportedTransactionVersion: 0 });
        expect(mockCache.set).toHaveBeenCalledWith('block-200', 2, SolanaService.BLOCK_CACHE_TTL);
    });

    it('should return 0 if block has no transactions', async () => {
        (mockCache.get as jest.Mock).mockResolvedValue(undefined);
        connection.getBlock.mockResolvedValue({
            transactions: [],
            maxSupportedTransactionVersion: 0,
        });

        const count = await service.getTransactionCount(100);
        expect(count).toBe(0);
        expect(mockCache.set).toHaveBeenCalledWith('block-100', 0, SolanaService.BLOCK_CACHE_TTL);
    });
});
