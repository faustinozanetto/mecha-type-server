import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserWhereInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  username?: string;
}
