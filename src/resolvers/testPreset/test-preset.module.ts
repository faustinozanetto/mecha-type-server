import { Module } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';
import { TestPresetService } from 'services/test-preset.service';
import { TestPresetResolver } from './test-preset.resolver';

@Module({
  imports: [PrismaService],
  providers: [TestPresetResolver, TestPresetService, PrismaService],
})
export class TestPresetModule {}
