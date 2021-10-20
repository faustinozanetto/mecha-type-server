import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FilteredUser } from 'models/user/filtered-user';
import { User } from 'models/user/user.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class FilteredUsersEdge {
  @Field(() => Date, { nullable: true })
  cursor: Date;

  @Field(() => FilteredUser, { nullable: true })
  node: FilteredUser;
}

@ObjectType()
export class FilteredUsersPageInfo {
  @Field(() => Date, { nullable: true })
  startCursor: Date;

  @Field(() => Date, { nullable: true })
  endCursor: Date;

  @Field(() => Boolean, { nullable: true })
  hasMore: boolean;
}

@ObjectType()
export class FilteredUsersResponse {
  @Field(() => Int, { nullable: true })
  count: number;

  @Field(() => FilteredUsersPageInfo, { nullable: true })
  pageInfo: FilteredUsersPageInfo;

  @Field(() => [FilteredUsersEdge], { nullable: true })
  edges: FilteredUsersEdge[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
