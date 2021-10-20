import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ErrorResponse } from '../error/error.model';

export enum FollowRequestStatus {
  NOTSENT = 'NOTSENT',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

registerEnumType(FollowRequestStatus, {
  name: 'FollowStatus',
  description: 'Status of the follow request',
});

@ObjectType()
export class FollowUserStatusResponse {
  @Field(() => FollowRequestStatus, { nullable: true })
  status?: FollowRequestStatus;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
