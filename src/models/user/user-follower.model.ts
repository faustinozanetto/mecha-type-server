import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../base.model';
import { AuthProvider } from './user.model';

@ObjectType()
export class UserFollower extends BaseModel {
  @Field(() => String)
  username: string;

  @Field(() => String)
  avatar: string;

  @Field(() => AuthProvider, { nullable: true })
  authProvider?: AuthProvider;

  @Field(() => String, { nullable: true })
  oauthId?: string;
}
