import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserTestPresetsHistoryInput {
  @Field(() => String, { nullable: true })
  username: string;
}
