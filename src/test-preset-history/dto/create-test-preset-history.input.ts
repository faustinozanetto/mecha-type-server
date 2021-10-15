import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateTestPresetHistoryInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  testPresetId: string;

  @Field(() => Float)
  wpm: number;

  @Field(() => Float)
  cpm: number;

  @Field(() => Float)
  accuracy: number;

  @Field(() => Float)
  keystrokes: number;

  @Field(() => Float)
  correctChars: number;

  @Field(() => Float)
  incorrectChars: number;
}
