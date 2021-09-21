import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { TestLanguage, TestType } from 'models/test-preset/test-preset.model';

@InputType()
export class CreateTestPresetInput {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  creatorImage?: string;

  @Field(() => TestType)
  @IsNotEmpty()
  type: TestType;

  @Field(() => TestLanguage)
  @IsNotEmpty()
  language: TestLanguage;

  @Field(() => Int)
  @IsNotEmpty()
  time: number;

  @Field(() => Int)
  @IsNotEmpty()
  words: number;
}
