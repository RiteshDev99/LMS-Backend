import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async registerUser(registerUserDto: RegisterDto) {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      registerUserDto.password,
      saltRounds,
    );
    console.log('registerUserDto', registerUserDto);
    // Logic to register a user (e.g., save to database)
    // 1. check if email is already exists
    // 2. hash the password
    // 3. store the user into db
    // 4. generate a JWT token
    // 5. send token in response
    return this.userService.createUser({...registerUserDto, password: hashedPassword});
  }
}
