import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TestPreset } from 'models/test-preset/test-preset.model';
import { CreateTestPresetInput } from './dto/create-test-preset.input';
import { TestPresetService } from 'services/test-preset.service';
import { TestPresetsFindInput } from './dto/test-presets-find.input';

@Resolver(() => TestPreset)
export class TestPresetResolver {
  constructor(private readonly testPresetService: TestPresetService) {}

  @Query(() => TestPreset)
  async testPreset(@Args('id') id: string) {
    return await this.testPresetService.testPreset(id);
  }

  @Query(() => [TestPreset])
  async testPresets(
    @Args('input', { nullable: true, type: () => TestPresetsFindInput })
    input?: TestPresetsFindInput,
  ) {
    return await this.testPresetService.testPresets(input);
  }

  @Query(() => [TestPreset])
  async userTestPresets(@Args('userId') userId: string) {
    return await this.testPresetService.userTestPresets(userId);
  }

  @Mutation(() => TestPreset)
  async createTestPreset(
    @Args('data', { type: () => CreateTestPresetInput }) data: CreateTestPresetInput,
  ) {
    return await this.testPresetService.createTestPreset(data);
  }

  @Mutation(() => TestPreset)
  async createTestPresetUser(
    @Args('data', { type: () => CreateTestPresetInput }) data: CreateTestPresetInput,
  ) {
    return await this.testPresetService.createTestPresetUser(data);
  }
}
