import { ObjectType, Field } from '@nestjs/graphql';
import { FollowRequestStatus } from 'models/responses/user/follow-user-status.response';
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

  @Field(() => FollowRequestStatus, { nullable: true })
  status?: FollowRequestStatus;
}
