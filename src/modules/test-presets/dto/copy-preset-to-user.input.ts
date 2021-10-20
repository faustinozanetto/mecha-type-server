import { Field, InputType } from '@nestjs/graphql';
import { UserWhereInput } from 'modules/user/dto/user-where.input';

@InputType()
export class CopyPresetToUserInput {
  @Field(() => String)
  presetId: string;

  @Field(() => UserWhereInput)
  user: UserWhereInput;
}
