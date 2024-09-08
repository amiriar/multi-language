import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Blog' }] })
  blogs?: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
