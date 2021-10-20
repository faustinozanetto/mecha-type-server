import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class RequestFollowUserResponse {
  @Field(() => Boolean, { nullable: true })
  requestSent?: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
