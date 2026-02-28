import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

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
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hashedPassword,
    });

    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);
    console.log('Token', token);
    return { access_token: token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user._id };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
