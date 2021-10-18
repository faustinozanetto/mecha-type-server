import { Field, InputType, Int } from '@nestjs/graphql';
import { TestLanguage, TestType } from 'models/test-preset/test-preset.model';

@InputType()
export class TestPresetWhereInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => TestType, { nullable: true })
  type?: TestType;

  @Field(() => TestLanguage, { nullable: true })
  language?: TestLanguage;

  @Field(() => Int, { nullable: true })
  time?: number;

  @Field(() => Int, { nullable: true })
  words?: number;

  @Field(() => Boolean, { nullable: true })
  punctuated?: boolean;
}
