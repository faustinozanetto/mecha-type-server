import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserSettingsWhereInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  userId?: string;
}
