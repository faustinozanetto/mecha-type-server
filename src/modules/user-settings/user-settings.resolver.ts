import { Resolver } from '@nestjs/graphql';
import { UserSettings } from 'models/user-settings/user-settings.model';
import { UserSettingsService } from './user-settings.service';

@Resolver(() => UserSettings)
export class UserSettingsResolver {
  constructor(private readonly userSettingsService: UserSettingsService) {}
}
