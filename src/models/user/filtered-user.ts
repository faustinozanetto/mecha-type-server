import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

@ObjectType()
export class FilteredUser extends BaseModel {
  @Field(() => String)
  username: string;

  @Field(() => String)
  avatar: string;

  @Field(() => String)
  country: string;

  @Field(() => Float)
  value: number;
}
