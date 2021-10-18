import { Module } from '@nestjs/common';
import { UserSettingsResolver } from './user-settings.resolver';
import { UserSettingsService } from './user-settings.service';

@Module({
  imports: [],
  providers: [UserSettingsResolver, UserSettingsService],
})
export class UserSettingsModule {}
