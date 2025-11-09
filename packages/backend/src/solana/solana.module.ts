import { Module } from '@nestjs/common';
import { SolanaService } from './solana.service';
import { SolanaController } from './solana.controller';
import {CacheModule} from "@nestjs/cache-manager";

@Module({
  imports: [CacheModule.register({ ttl: 60 })],
  providers: [SolanaService],
  controllers: [SolanaController],
})
export class SolanaModule {}
