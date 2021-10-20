import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class AcceptFollowRequestResponse {
  @Field(() => Boolean, { nullable: true })
  accepted?: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
