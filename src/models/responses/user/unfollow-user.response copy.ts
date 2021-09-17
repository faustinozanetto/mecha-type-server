import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class UnfollowUserResponse {
  @Field(() => Boolean, { nullable: true })
  unfollow?: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
