import { Field, InputType, Int } from '@nestjs/graphql';
import { TestPresetWhereInput } from './test-preset-where.input';

@InputType()
export class TestPresetsFindInput {
  @Field(() => Int, { nullable: false })
  skip: number;

  @Field(() => Int, { nullable: false })
  take: number;

  @Field(() => TestPresetWhereInput, { nullable: true })
  where?: TestPresetWhereInput;
}
