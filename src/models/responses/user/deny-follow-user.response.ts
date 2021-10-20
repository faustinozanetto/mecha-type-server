import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class DenyFollowRequestResponse {
  @Field(() => Boolean, { nullable: true })
  denied?: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
