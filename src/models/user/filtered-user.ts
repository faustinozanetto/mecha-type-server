import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

@ObjectType()
export class FilteredUser extends BaseModel {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  country: string;

  @Field(() => Float)
  value: number;
}
