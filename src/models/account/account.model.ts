import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

@ObjectType()
export class User extends BaseModel {
  @Field(() => String, { nullable: true })
  discordId?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
