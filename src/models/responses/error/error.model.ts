import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ErrorResponse {
  @Field(() => String)
  field?: string;

  @Field(() => String)
  message?: string;
}
