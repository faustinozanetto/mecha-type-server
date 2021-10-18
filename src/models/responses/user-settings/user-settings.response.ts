import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'models/user/user.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class UserSettingsResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
