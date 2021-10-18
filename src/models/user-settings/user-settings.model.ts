import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

@ObjectType()
export class UserSettings extends BaseModel {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => Boolean, { nullable: true })
  blindMode?: boolean;

  @Field(() => Boolean, { nullable: true })
  pauseOnError?: boolean;

  @Field(() => Boolean, { nullable: true })
  noBackspace?: boolean;

  @Field(() => Boolean, { nullable: true })
  typeSounds?: boolean;

  @Field(() => Float, { nullable: true })
  typeSoundsVolume?: number;
}
