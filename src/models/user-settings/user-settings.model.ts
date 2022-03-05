import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from '../base.model';

export enum CaretStyle {
  LINE = 'Line',
  BLOCK = 'Block',
  HOLLOW = 'Hollow',
}

registerEnumType(CaretStyle, {
  name: 'CaretStyle',
  description: 'Style of the Caret',
});

@ObjectType()
export class UserSettings extends BaseModel {
  @Field(() => String, { nullable: true })
  userId?: string;

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
