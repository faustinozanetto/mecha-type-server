import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @Field()
  id: string;
  @Field({
    description: 'Identifies the date and time when the object was created.',
    nullable: true,
  })
  createdAt?: Date;
  @Field({
    description: 'Identifies the date and time when the object was last updated.',
    nullable: true,
  })
  updatedAt?: Date;
}
