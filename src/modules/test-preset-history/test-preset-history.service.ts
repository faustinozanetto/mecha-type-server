import { Injectable } from '@nestjs/common';
import { TestPresetHistoryResponse } from 'models/responses/test-preset-history/test-preset-history-response.model';
import { TestPresetsHistoryResponse } from 'models/responses/test-preset-history/test-presets-history-response.model';
import { PrismaService } from 'nestjs-prisma';
import { CreateTestPresetHistoryInput } from './dto/create-test-preset-history.input';
import { UserTestPresetsHistoryInput } from './dto/user-test-presets-history.input';

@Injectable()
export class TestPresetHistoryService {
  constructor(private prisma: PrismaService) {}

  async createTestPresetHistoryEntry(
    input: CreateTestPresetHistoryInput,
  ): Promise<TestPresetHistoryResponse> {
    const testPresetHistory = await this.prisma.testPresetHistory.create({ data: input });
    if (testPresetHistory) {
      return { testPresetHistory };
    }
  }

  async userCreateTestPresetHistoryEntry(
    userId: string,
    input: CreateTestPresetHistoryInput,
  ): Promise<TestPresetHistoryResponse> {
    const testPresetHistory = await this.prisma.testPresetHistory.create({ data: input });
    await this.prisma.user.update({
      where: { id: userId },
      data: { testPresetHistory: { connect: { id: testPresetHistory.id } } },
    });
    if (testPresetHistory) {
      return { testPresetHistory };
    }
  }

  async userTestPresetsHistory(
    input: UserTestPresetsHistoryInput,
  ): Promise<TestPresetsHistoryResponse> {
    try {
      const historyPresets = await this.prisma.testPresetHistory.findMany({
        where: { user: { username: { equals: input.username } } },
        orderBy: { createdAt: 'desc' },
      });
      // Valid results
      if (historyPresets.length > 0) {
        return { testPresetHistory: historyPresets };
      } else
        return {
          testPresetHistory: [],
        };
    } catch (error) {
      return {
        testPresetHistory: [],
        errors: [
          {
            field: 'input',
            message: 'An error occurred!',
          },
        ],
      };
    }
  }
}
