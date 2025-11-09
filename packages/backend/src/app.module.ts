import { Module } from '@nestjs/common';
import { SolanaModule } from './solana/solana.module';

@Module({
    imports: [
        SolanaModule,
    ],
})
export class AppModule {}
