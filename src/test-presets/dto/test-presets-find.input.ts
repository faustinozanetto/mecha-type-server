import { Field, InputType, Int } from '@nestjs/graphql';
import { TestPresetWhereInput } from './test-preset-where.input';

@InputType()
export class TestPresetsFindInput {
  @Field(() => Int, {
    description:
      'It represents the current page starting from 0, so currentPage = 2, it indeed is page # 3',
    nullable: false,
  })
  currentPage: number;

  @Field(() => Int, { nullable: false })
  pageSize: number;

  @Field(() => TestPresetWhereInput, { nullable: true })
  where?: TestPresetWhereInput;
}
