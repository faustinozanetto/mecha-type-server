import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TestPreset } from 'models/test-preset/test-preset.model';
import { TestPresetHistoryService } from './test-preset-history.service';
import { TestPresetHistoryResponse } from 'models/responses/test-preset-history/test-preset-history-response.model';
import { CreateTestPresetHistoryInput } from './dto/create-test-preset-history.input';

@Resolver(() => TestPreset)
export class TestPresetHistoryResolver {
  constructor(private readonly testPresetHistoryService: TestPresetHistoryService) {}

  @Mutation(() => TestPresetHistoryResponse)
  async createTestPresetHistoryEntry(
    @Args('input', { type: () => CreateTestPresetHistoryInput })
    input: CreateTestPresetHistoryInput,
  ): Promise<TestPresetHistoryResponse> {
    return await this.testPresetHistoryService.createTestPresetHistoryEntry(input);
  }

  @Mutation(() => TestPresetHistoryResponse)
  async userCreateTestPresetHistoryEntry(
    @Args('userId', { type: () => String }) userId: string,
    @Args('input', { type: () => CreateTestPresetHistoryInput })
    input: CreateTestPresetHistoryInput,
  ): Promise<TestPresetHistoryResponse> {
    return await this.testPresetHistoryService.userCreateTestPresetHistoryEntry(userId, input);
  }
}
