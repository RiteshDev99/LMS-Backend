import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/registerUser.dto';

@Injectable()
export class UserService {
  createUser(registerUserDto: RegisterDto){
    return { message: 'User created successfully' };
  }
}
