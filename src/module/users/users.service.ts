import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Otp, OtpDocument } from 'src/otherEntities/Otp.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel
      .findById(id, { __v: 0, createdAt: 0, updatedAt: 0 })
      .exec();
  }

  async findOneByPhone(phone: string): Promise<User> {
    return await this.userModel.findOne({ phoneNumber: phone }).exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async createUser(phone: string, madeIn: string): Promise<User> {
    return await this.userModel.create({ phoneNumber: phone, madeIn });
  }

  async saveUser(user: UserDocument): Promise<User> {
    const userData = await this.userModel
      .findByIdAndUpdate(user._id, user, { new: true })
      .exec();
    return userData;
  }

  async deleteUser(id: string): Promise<User> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userData = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .exec();
    return userData;
  }
}
