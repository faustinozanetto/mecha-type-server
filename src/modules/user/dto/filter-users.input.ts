import { Field, InputType, Int } from '@nestjs/graphql';
import { UserFilterBy } from 'models/user/user.model';
import { UserWhereInput } from './user-where.input';

@InputType()
export class FilterUsersInput {
  @Field(() => Int, { nullable: false })
  skip: number;

  @Field(() => Int, { nullable: false })
  take: number;

  @Field(() => UserFilterBy, { nullable: false })
  filterBy: UserFilterBy;

  @Field(() => UserWhereInput, { nullable: true })
  where?: UserWhereInput;
}
