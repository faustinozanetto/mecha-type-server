import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestPresetEntity } from 'entities/test-preset.entity';
import { UserEntity } from 'entities/user.entity';
import { TestPresetService } from 'test-presets/test-preset.service';
import { TestPresetResolver } from './test-preset.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TestPresetEntity, UserEntity])],
  providers: [TestPresetResolver, TestPresetService],
})
export class TestPresetModule {}
