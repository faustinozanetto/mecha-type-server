import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';
import { User } from '../user/user.model';

@ObjectType()
export class UserOnUser extends BaseModel {
  @Field(() => User, { nullable: true })
  child?: User;

  @Field(() => String, { nullable: true })
  childId?: string;

  @Field(() => User, { nullable: true })
  parent?: User;

  @Field(() => String, { nullable: true })
  parentId?: string;
}
