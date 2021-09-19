import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FilteredUser } from 'models/user/filtered-user';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class FilteredUsersResponse {
  @Field(() => [FilteredUser], { nullable: true })
  nodes?: FilteredUser[];

  @Field(() => Int, { nullable: true })
  nodeCount?: number;

  @Field(() => Int, { nullable: true })
  pageCount?: number;

  @Field(() => Int, { nullable: true })
  currentPage?: number;

  @Field(() => Int, { nullable: true })
  nodesPerPage?: number;

  @Field(() => Boolean, { nullable: true })
  hasMore?: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
