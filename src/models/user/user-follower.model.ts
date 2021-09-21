import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

@ObjectType()
export class UserFollower extends BaseModel {
  @Field(() => String)
  username: string;

  @Field(() => String)
  avatar: string;
}
