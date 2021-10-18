import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TestPreset } from 'models/test-preset/test-preset.model';
import { ErrorResponse } from '../error/error.model';

@ObjectType()
export class Edge {
  @Field(() => Date, { nullable: true })
  cursor: Date;

  @Field(() => TestPreset, { nullable: true })
  node: TestPreset;
}

@ObjectType()
export class PageInfo {
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

  @Field(() => PageInfo, { nullable: true })
  pageInfo: PageInfo;

  @Field(() => [Edge], { nullable: true })
  edges: Edge[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
