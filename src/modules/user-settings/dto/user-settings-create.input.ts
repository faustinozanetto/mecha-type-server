import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class UserSettingsCreateInput {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => Boolean, { nullable: true })
  blindMode?: boolean;

  @Field(() => Boolean, { nullable: true })
  pauseOnError?: boolean;

  @Field(() => Boolean, { nullable: true })
  noBackspace?: boolean;

  @Field(() => Boolean, { nullable: true })
  typeSounds?: boolean;

  @Field(() => Float, { nullable: true })
  typeSoundsVolume?: number;
}
