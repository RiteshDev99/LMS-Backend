import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registerUserDto: RegisterDto) {
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(
      registerUserDto.password,
      saltRounds,
    );
    console.log('registerUserDto', registerUserDto);
    // Logic to register a user (e.g., save to database)
    // 1. V check if email is already exists
    // 2. V hash the password
    // 3. V store the user into db
    // 4. generate a JWT token
    // 5. send token in response
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hashedPassword,
    });

    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);
    console.log('Token', token);
    return { access_token: token };
  }
}
