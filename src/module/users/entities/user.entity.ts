import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false })
  username: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  password: string;  // Remember to hash this in a middleware or service
  
  @Prop()
  firstname?: string;

  @Prop()
  lastname?: string;

  @Prop()
  job?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  followers?: Types.ObjectId[];

  @Prop()
  linkedin?: string;

  @Prop()
  twitter?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Blog' }] })
  savedPosts?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Blog' }] })
  likedPosts?: Types.ObjectId[];

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop()
  profile?: string;

  @Prop({ default: "USER" })
  role: string;
  
  @Prop()
  lastDateIn?: string;

  @Prop()
  madeIn?: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiresAt?: Date;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
