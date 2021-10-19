import { Field, InputType, Int } from '@nestjs/graphql';
import { UserWhereInput } from './user-where.input';

@InputType()
export class UserFollowersFindInput {
  @Field(() => Int, { nullable: false })
  skip: number;

  @Field(() => Int, { nullable: false })
  take: number;

  @Field(() => UserWhereInput, { nullable: true })
  where?: UserWhereInput;
}
