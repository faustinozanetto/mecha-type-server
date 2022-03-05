import { Field, Float, InputType } from '@nestjs/graphql';
import { CaretStyle } from 'models/user-settings/user-settings.model';

@InputType()
export class UserSettingsUpdateInput {
  @Field(() => String, { nullable: false })
  userId: string;

  @Field(() => CaretStyle, { nullable: true })
  caretStyle?: CaretStyle;

  @Field(() => String, { nullable: true })
  caretColor?: string;

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
