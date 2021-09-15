import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { UserBadge } from 'models/user/user.model';
import { AccuracyCreateInput } from './accuracy-create.input';
import { CharsPerMinuteCreateInput } from './chars-per-minute-create.input';
import { WordsPerMinuteCreateInput } from './words-per-minute-create.input';

@InputType()
export class InputUpdateInput {
  @Field(() => Float, { nullable: true })
  set?: number;

  @Field(() => Float, { nullable: true })
  increment?: number;

  @Field(() => Float, { nullable: true })
  decrement?: number;

  @Field(() => Float, { nullable: true })
  multiply?: number;

  @Field(() => Float, { nullable: true })
  divide?: number;
}

@InputType()
export class UserUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => UserBadge, { nullable: true })
  badge?: UserBadge;

  @Field(() => InputUpdateInput, { nullable: true })
  keystrokes?: InputUpdateInput;

  @Field(() => InputUpdateInput, { nullable: true })
  testsCompleted?: InputUpdateInput;

  @Field(() => InputUpdateInput, { nullable: true })
  wordsWritten?: InputUpdateInput;

  @Field(() => WordsPerMinuteCreateInput, { nullable: true })
  wordsPerMinute?: WordsPerMinuteCreateInput;

  @Field(() => CharsPerMinuteCreateInput, { nullable: true })
  charsPerMinute?: CharsPerMinuteCreateInput;

  @Field(() => AccuracyCreateInput, { nullable: true })
  accuracy?: AccuracyCreateInput;
}
