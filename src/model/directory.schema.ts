import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type VideoDocument = Video & Document;
@Schema()
export class Video {
    @Prop()
    title: string;
    @Prop()
    path: string;
}
export const VideoSchema = SchemaFactory.createForClass(Video)