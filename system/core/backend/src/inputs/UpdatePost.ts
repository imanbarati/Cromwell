import { TPostInput } from "@cromwell/core/es";
import { InputType, Field, ID } from "type-graphql";
import { BasePageInput } from './BasePageInput';

@InputType({ description: "New Post data" })
export class UpdatePost extends BasePageInput implements TPostInput {

    @Field()
    title: string;

    @Field()
    authorId: string;

    @Field(() => String, { nullable: true })
    mainImage?: string;

    @Field()
    content: string;

    @Field()
    isPublished: boolean;
}