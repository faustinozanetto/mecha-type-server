import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';
import { TestPreset } from '../test-preset/test-preset.model';
import { UserOnUser } from '../user-on-user/userOnUser.model';
import { TestPresetHistory } from './test-preset-history.model';

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

export enum AuthProvider {
  DEFAULT = 'DEFAULT',
  DISCORD = 'DISCORD',
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
}

registerEnumType(AuthProvider, {
  name: 'AuthProvider',
  description: 'User auth provider service',
});

@ObjectType()
export class User extends BaseModel {
  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  oauthId?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => UserBadge, { nullable: true })
  badge?: UserBadge;

  @Field(() => AuthProvider, { nullable: true })
  authProvider?: AuthProvider;

  @Field(() => [UserOnUser], { nullable: true })
  followedBy?: UserOnUser[];

  @Field(() => [UserOnUser], { nullable: true })
  following?: UserOnUser[];

  @Field(() => [TestPresetHistory], { nullable: true })
  testPresetHistory?: TestPresetHistory[];

  @Field(() => [TestPreset], { nullable: true })
  testPresets?: TestPreset[];
}
