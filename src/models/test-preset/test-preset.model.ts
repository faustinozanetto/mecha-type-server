import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

export enum TestType {
  WORDS = 'WORDS',
  TIME = 'TIME',
}

registerEnumType(TestType, {
  name: 'TestType',
  description: 'Test Type',
});

export enum TestLanguage {
  ENGLISH = 'ENGLISH',
  SPANISH = 'SPANISH',
}

registerEnumType(TestLanguage, {
  name: 'TestLanguage',
  description: 'Test Language',
});

@ObjectType()
export class TestPreset extends BaseModel {
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

  @Field(() => String, { nullable: true })
  creatorImage?: string;

  @Field(() => String, { nullable: true })
  userId?: string | null;
}
