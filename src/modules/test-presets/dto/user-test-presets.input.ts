import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UserTestPresetsInput {
  @Field(() => Int, { nullable: false })
  skip: number;

  @Field(() => Int, { nullable: false })
  take: number;

  @Field(() => String, { nullable: true })
  username?: string;
}
