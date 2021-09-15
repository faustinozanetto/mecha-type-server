import { Field, ObjectType } from '@nestjs/graphql';
import { UserFollower } from 'models/user/user-follower.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class UserFollowersResponse {
  @Field(() => [UserFollower], { nullable: true })
  users?: UserFollower[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
