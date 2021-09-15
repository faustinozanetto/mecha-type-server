import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'models/user/user.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class UsersResponse {
  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
