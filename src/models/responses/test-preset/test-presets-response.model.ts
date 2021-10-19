import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TestPreset } from 'models/test-preset/test-preset.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class TestPresetsEdge {
  @Field(() => Date, { nullable: true })
  cursor: Date;

  @Field(() => TestPreset, { nullable: true })
  node: TestPreset;
}

@ObjectType()
export class TestPresetsPageInfo {
  @Field(() => Date, { nullable: true })
  startCursor: Date;

  @Field(() => Date, { nullable: true })
  endCursor: Date;

  @Field(() => Boolean, { nullable: true })
  hasMore: boolean;
}

@ObjectType()
export class TestPresetsResponse {
  @Field(() => Int, { nullable: true })
  count: number;

  @Field(() => TestPresetsPageInfo, { nullable: true })
  pageInfo: TestPresetsPageInfo;

  @Field(() => [TestPresetsEdge], { nullable: true })
  edges: TestPresetsEdge[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
