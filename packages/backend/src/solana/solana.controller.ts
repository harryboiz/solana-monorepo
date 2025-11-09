import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SolanaService } from './solana.service';

@Controller('solana')
export class SolanaController {
    constructor(private readonly solanaService: SolanaService) {}

    // @ts-ignore
    @Get('block/tx-count')
    // @ts-ignore
    async getBlockTxCount(@Query('block') block: string): Promise<{ block: number; transactionCount: number }> {
        if (!block) {
            throw new BadRequestException('Query parameter "block" is required');
        }

        const blockNumber = parseInt(block, 10);
        if (isNaN(blockNumber)) {
            throw new BadRequestException('"block" must be a valid number');
        }
        if (blockNumber < 0) {
            throw new BadRequestException('"block" must be equals or greater than 0');
        }

        const count = await this.solanaService.getTransactionCount(blockNumber);
        return { block: blockNumber, transactionCount: count };
    }
}
