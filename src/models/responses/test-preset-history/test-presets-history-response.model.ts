import { Field, ObjectType } from '@nestjs/graphql';
import { TestPresetHistory } from 'models/user/test-preset-history.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class TestPresetsHistoryResponse {
  @Field(() => [TestPresetHistory], { nullable: true })
  testPresetHistory?: TestPresetHistory[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
