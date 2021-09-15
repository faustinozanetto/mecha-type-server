import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

@ObjectType()
export class TypingAccuracy extends BaseModel {
  @Field(() => Float)
  amount: number;

  @Field(() => String)
  userId: string;
}
