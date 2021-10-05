import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TestPresetService } from 'test-presets/test-preset.service';
import { TestPresetResolver } from './test-preset.resolver';

@Module({
  imports: [PrismaService],
  providers: [PrismaService, TestPresetResolver, TestPresetService],
})
export class TestPresetModule {}
