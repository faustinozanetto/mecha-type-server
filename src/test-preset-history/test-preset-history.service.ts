import { Injectable } from '@nestjs/common';
import { TestPresetHistoryResponse } from 'models/responses/test-preset-history/test-preset-history-response.model';
import { PrismaService } from 'nestjs-prisma';
import { CreateTestPresetHistoryInput } from './dto/create-test-preset-history.input';

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
}
