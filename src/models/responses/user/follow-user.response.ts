import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class FollowUserResponse {
  @Field(() => Boolean, { nullable: true })
  follow?: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
