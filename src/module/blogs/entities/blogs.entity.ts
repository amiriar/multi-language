import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BlogDocument = Blog & Document;

// Schema for Comment
@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  author: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  replies?: Types.ObjectId[]; // Self-referencing field for nested comments

  @Prop({ required: false })
  date: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ maxlength: 500 })
  description?: string;

  @Prop()
  image?: string;

  @Prop({ required: false })
  body?: string; // This can be an HTML string, JSON, or a structured format for various content types

  @Prop({ required: false })
  tags?: string[];

  @Prop({ default: 0 })
  likesCount?: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  likes?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments?: Types.ObjectId[]; // Reference to the Comment schema

  @Prop({ required: false })
  timeToRead?: number;

  @Prop({ required: false })
  shortLink?: string;

  @Prop({ ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ required: false })
  date: string;

  @Prop({ default: false })
  isShown: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.index({ title: 1, description: 1 });
