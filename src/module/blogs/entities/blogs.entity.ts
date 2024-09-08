import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  replies?: Types.ObjectId[]; // Nested comments

  @Prop({ required: false })
  date: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema()
export class LanguageContent {
  @Prop({ required: true })
  language: string; // e.g. 'en', 'fr'

  @Prop({ required: true })
  title: string;

  @Prop({ maxlength: 500 })
  description?: string;

  @Prop({ required: false })
  body?: string; // Structured content for various languages

  @Prop({ required: false })
  date: string;

  @Prop({ default: false })
  isShown: boolean;
}

export const LanguageContentSchema =
  SchemaFactory.createForClass(LanguageContent);

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  image?: string;

  @Prop({ type: [LanguageContentSchema], required: true })
  languages: LanguageContent[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  likes?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments?: Types.ObjectId[]; // Reference to the Comment schema

  @Prop({ required: false, unique: true })
  shortLink?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category?: Types.ObjectId; 

  @Prop({ ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ default: false })
  isShown: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.index({ 'languages.title': 1, 'languages.description': 1 });
