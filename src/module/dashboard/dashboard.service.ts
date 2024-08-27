import { Injectable } from '@nestjs/common';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../admin/users/entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class DashboardService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  update(id: string, updateDashboardDto: UpdateDashboardDto) {
    return this.userModel.updateOne({ _id: id }, updateDashboardDto);
  }
}
