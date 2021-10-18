import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { UserSettingsResponse } from 'models/responses/user-settings/user-settings.response';
import { UserSettings } from 'models/user-settings/user-settings.model';
import { GraphQLAuthGuard } from 'modules/auth/utils/guards';
import { UserSettingsCreateInput } from './dto/user-settings-create.input';
import { UserSettingsUpdateInput } from './dto/user-settings-update.input';
import { UserSettingsWhereInput } from './dto/user-settings-where.input';
import { UserSettingsService } from './user-settings.service';

@Resolver(() => UserSettings)
export class UserSettingsResolver {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @UseGuards(GraphQLAuthGuard)
  @Query(() => UserSettingsResponse)
  async userSettings(
    @Args('input', { type: () => UserSettingsWhereInput }) input: UserSettingsWhereInput,
  ): Promise<UserSettingsResponse> {
    return await this.userSettingsService.userSettings(input);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => UserSettingsResponse)
  async createUserSettings(
    @Args('input', { type: () => UserSettingsCreateInput })
    input: UserSettingsCreateInput,
  ): Promise<UserSettingsResponse> {
    return await this.userSettingsService.createUserSettings(input);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => UserSettingsResponse)
  async updateUserSettings(
    @Args('input', { type: () => UserSettingsUpdateInput })
    input: UserSettingsUpdateInput,
  ): Promise<UserSettingsResponse> {
    return await this.userSettingsService.updateUserSettings(input);
  }
}
