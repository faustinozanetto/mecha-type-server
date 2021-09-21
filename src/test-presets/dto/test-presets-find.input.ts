import { Field, InputType, Int } from '@nestjs/graphql';
import { TestPresetWhereInput } from './test-preset-where.input';

@InputType()
export class TestPresetsFindInput {
  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => TestPresetWhereInput, { nullable: true })
  where?: TestPresetWhereInput;
}
