import { Field, InputType, Int } from '@nestjs/graphql';
import { TestPresetWhereInput } from './test-preset-where.input';

@InputType()
export class TestPresetsFindInput {
  @Field(() => Int, { nullable: false })
  currentPage: number;

  @Field(() => Int, { nullable: false })
  pageSize: number;

  @Field(() => TestPresetWhereInput, { nullable: true })
  where?: TestPresetWhereInput;
}
