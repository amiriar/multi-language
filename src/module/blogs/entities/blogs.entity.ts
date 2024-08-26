import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

export enum BodySchema {
  // body logic here
}

// comments schema here too
// comments should have:
// نام نویسنده، تصویر نویسنده، تاریخ نوشتن کامنت، تعداد لایک های کامنت، متن  کامنت، و قابلیت پاسخ دادن به کامنت به همراه پیجینیشن

@Schema({ timestamps: true })
export class Blog {

  @Prop({ required: false })
  timeToRead: number;

  @Prop({ required: false })
  shortLink: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false, maxlength: 500 })
  description?: string;

  @Prop({ required: false })
  image?: string;
  
  // Body logic HERE 
  
  // @Prop({ required: true, enum: BodySchema })
  // body: BodySchema;

  // Body logic HERE 

  @Prop({ required: false })
  tags: [string];
  
  @Prop({ required: false })
  likes: [string];

  // @Prop({ required: false })
  // comments: [string];
  
  // / // // / / // /  / / / // / 
  @Prop({ required: false })
  date?: string;

}

export const BlogSchema = SchemaFactory.createForClass(Blog);
