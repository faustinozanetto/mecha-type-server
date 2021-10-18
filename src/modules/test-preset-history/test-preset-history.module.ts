import { Module } from '@nestjs/common';
import { TestPresetHistoryResolver } from './test-preset-history.resolver';
import { TestPresetHistoryService } from './test-preset-history.service';

@Module({
  imports: [],
  providers: [TestPresetHistoryResolver, TestPresetHistoryService],
})
export class TestPresetHistoryModule {}
