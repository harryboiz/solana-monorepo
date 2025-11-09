import { Inject, Injectable } from '@nestjs/common';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SolanaService {
    static BLOCK_CACHE_TTL = 60*15;

    private connection: Connection;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        this.connection = new Connection(clusterApiUrl('mainnet-beta'));
    }

    async getTransactionCount(blockNumber: number): Promise<number> {
        const cacheKey = `block-${blockNumber}`;

        const cached = await this.cacheManager.get<number>(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        const block = await this.connection.getBlock(blockNumber, {
            maxSupportedTransactionVersion: 0,
        });
        if (!block) throw new Error('Block not found');

        const txCount = block.transactions.length;

        await this.cacheManager.set(cacheKey, txCount, SolanaService.BLOCK_CACHE_TTL);

        return txCount;
    }
}
