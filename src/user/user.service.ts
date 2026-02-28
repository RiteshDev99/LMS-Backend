import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/registerUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/userSchema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(registerUserDto: RegisterDto) {
    return await this.userModel.create({
      fname: registerUserDto.fname,
      lname: registerUserDto.lname,
      email: registerUserDto.email,
      password: registerUserDto.password,
    });
  }
}
