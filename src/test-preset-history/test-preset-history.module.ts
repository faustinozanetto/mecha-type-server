import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TestPresetHistoryResolver } from './test-preset-history.resolver';
import { TestPresetHistoryService } from './test-preset-history.service';

@Module({
  imports: [PrismaService],
  providers: [PrismaService, TestPresetHistoryResolver, TestPresetHistoryService],
})
export class TestPresetHistoryModule {}
