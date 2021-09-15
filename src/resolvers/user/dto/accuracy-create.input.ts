import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class AccuracyCreateInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
