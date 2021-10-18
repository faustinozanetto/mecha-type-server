import { Field, ObjectType } from '@nestjs/graphql';
import { UserSettings } from 'models/user-settings/user-settings.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class UserSettingsResponse {
  @Field(() => UserSettings, { nullable: true })
  userSettings?: UserSettings;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
