import { Field, Float, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class FilteredUser extends User {
  @Field(() => Float)
  value: number;
}
