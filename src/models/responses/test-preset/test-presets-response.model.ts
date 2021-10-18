import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TestPreset } from 'models/test-preset/test-preset.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class TestPresetsResponse {
  @Field(() => [TestPreset], { nullable: true })
  testPresets?: TestPreset[];

  @Field(() => Int, { nullable: true })
  totalPresets?: number;

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  currentPage?: number;

  @Field(() => Boolean, { nullable: true })
  hasMore?: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
