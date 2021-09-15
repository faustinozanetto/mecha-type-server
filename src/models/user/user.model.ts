import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';
import { CharsPerMinute } from './charsPerMinute.model';
import { TestPreset } from '../test-preset/test-preset.model';
import { TypingAccuracy } from './typing-accuracy.model';
import { UserOnUser } from '../user-on-user/userOnUser.model';
import { WordsPerMinute } from './wordsPerMinute.model';

export enum UserFilterBy {
  WPM = 'WPM',
  CPM = 'CPM',
  ACCURACY = 'ACCURACY',
  KEYSTROKES = 'KEYSTROKES',
  TESTSCOMPLETED = 'TESTSCOMPLETED',
}

registerEnumType(UserFilterBy, {
  name: 'UserFilterBy',
  description: 'Fields to filter Users By',
});

export enum UserBadge {
  DEFAULT = 'DEFAULT',
  TESTER = 'TESTER',
  PRO = 'PRO',
}

registerEnumType(UserBadge, {
  name: 'UserBadge',
  description: 'User Badges',
});

@ObjectType()
export class User extends BaseModel {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => Date, { nullable: true })
  emailVerified?: Date | null;

  @Field(() => String)
  description: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  country: string;

  @Field(() => Int)
  testsCompleted: number;

  @Field(() => Int)
  wordsWritten: number;

  @Field(() => Int)
  keystrokes: number;

  @Field(() => UserBadge)
  badge: UserBadge;

  @Field(() => [UserOnUser], { nullable: true })
  followedBy?: UserOnUser[];

  @Field(() => [UserOnUser], { nullable: true })
  following?: UserOnUser[];

  @Field(() => [WordsPerMinute], { nullable: true })
  wordsPerMinute?: WordsPerMinute[];

  @Field(() => [CharsPerMinute], { nullable: true })
  charsPerMinute?: CharsPerMinute[];

  @Field(() => [TypingAccuracy], { nullable: true })
  accuracy?: TypingAccuracy[];

  @Field(() => [TestPreset], { nullable: true })
  testPresets?: TestPreset[];
}
