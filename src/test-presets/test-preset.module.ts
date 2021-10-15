import { Module } from '@nestjs/common';
import { TestPresetService } from 'test-presets/test-preset.service';
import { TestPresetResolver } from './test-preset.resolver';

@Module({
  imports: [],
  providers: [TestPresetResolver, TestPresetService],
})
export class TestPresetModule {}
