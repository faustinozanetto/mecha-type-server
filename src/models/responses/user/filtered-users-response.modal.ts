import { Field, ObjectType } from '@nestjs/graphql';
import { FilteredUser } from 'models/user/filtered-user';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class FilteredUsersResponse {
  @Field(() => [FilteredUser], { nullable: true })
  filteredUsers?: FilteredUser[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
