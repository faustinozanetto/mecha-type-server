import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TestPreset } from 'models/test-preset/test-preset.model';
import { CreateTestPresetInput } from './dto/create-test-preset.input';
import { TestPresetService } from 'test-presets/test-preset.service';
import { TestPresetsFindInput } from './dto/test-presets-find.input';
import { TestPresetResponse } from 'models/responses/test-preset/test-preset-response.model';
import { TestPresetsResponse } from 'models/responses/test-preset/test-presets-response.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { User } from 'models/user/user.model';
import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from 'auth/utils/guards';

@Resolver(() => TestPreset)
export class TestPresetResolver {
  constructor(private readonly testPresetService: TestPresetService) {}

  @ResolveField(() => User)
  async creator(@Parent() testPreset: TestPreset): Promise<UserResponse> {
    return await this.testPresetService.presetCreator(testPreset.userId);
  }

  @Query(() => TestPresetResponse)
  async testPreset(@Args('id') id: string): Promise<TestPresetResponse> {
    return await this.testPresetService.testPreset(id);
  }

  @Query(() => TestPresetsResponse)
  async testPresets(
    @Args('input', { nullable: true, type: () => TestPresetsFindInput })
    input?: TestPresetsFindInput,
  ): Promise<TestPresetsResponse> {
    return await this.testPresetService.testPresets(input);
  }

  @Query(() => TestPresetsResponse)
  async userTestPresets(@Args('userId') userId: string): Promise<TestPresetsResponse> {
    return await this.testPresetService.userTestPresets(userId);
  }

  @Mutation(() => TestPresetResponse)
  async createTestPreset(
    @Args('data', { type: () => CreateTestPresetInput }) data: CreateTestPresetInput,
  ): Promise<TestPresetResponse> {
    return await this.testPresetService.createTestPreset(data);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => TestPresetResponse)
  async createTestPresetUser(
    @Args('data', { type: () => CreateTestPresetInput }) data: CreateTestPresetInput,
  ): Promise<TestPresetResponse> {
    return await this.testPresetService.createTestPresetUser(data);
  }
}
