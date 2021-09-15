import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

@ObjectType()
export class UserFollower extends BaseModel {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  image: string;
}
