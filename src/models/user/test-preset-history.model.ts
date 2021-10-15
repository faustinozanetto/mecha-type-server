import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

@ObjectType()
export class TestPresetHistory extends BaseModel {
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
