import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserFollower } from 'models/user/user-follower.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class UserFollowerEdge {
  @Field(() => Date, { nullable: true })
  cursor: Date;

  @Field(() => UserFollower, { nullable: true })
  node: UserFollower;
}

@ObjectType()
export class UserFollowersPageInfo {
  @Field(() => Date, { nullable: true })
  startCursor: Date;

  @Field(() => Date, { nullable: true })
  endCursor: Date;

  @Field(() => Boolean, { nullable: true })
  hasMore: boolean;
}

@ObjectType()
export class UserFollowersResponse {
  @Field(() => Int, { nullable: true })
  count: number;

  @Field(() => Int, { nullable: true })
  acceptedRequests: number;

  @Field(() => Int, { nullable: true })
  pendingRequests: number;

  @Field(() => UserFollowersPageInfo, { nullable: true })
  pageInfo: UserFollowersPageInfo;

  @Field(() => [UserFollowerEdge], { nullable: true })
  edges: UserFollowerEdge[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
