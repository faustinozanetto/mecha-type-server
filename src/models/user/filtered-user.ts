import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';
import { AuthProvider } from './user.model';

@ObjectType()
export class FilteredUser extends BaseModel {
  @Field(() => String)
  username: string;

  @Field(() => String)
  avatar: string;

  @Field(() => AuthProvider, { nullable: true })
  authProvider?: AuthProvider;

  @Field(() => String, { nullable: true })
  oauthId?: string;

  @Field(() => String)
  country: string;

  @Field(() => Float)
  value: number;
}
