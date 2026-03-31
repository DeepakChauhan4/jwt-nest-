import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import { BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

type UserData = { userId: number; username: string };
type AuthResult = { accessToken: string; userId: number; username: string };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: {
    username: string;
    password: string;
  }): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.signIn(user);
  }
  async validateUser(input: {
    username: string;
    password: string;
  }): Promise<UserData | null> {
    const user = await this.usersService.findUserByName(input.username);
    if (user && user.password === input.password) {
      return {
        userId: user.userId,
        username: user.username,
      };
    }
    return null;
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.usersService.findUserByName(dto.username);
    if (existing) {
      throw new BadRequestException('Username already exists');
    }
    const user = await this.usersService.create({
      username: dto.username,
      password: dto.password,
    } as CreateUserDto);
    return this.signIn({ userId: user.userId, username: user.username });
  }

  async signIn(user: UserData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return {
      accessToken: accessToken,
      userId: user.userId,
      username: user.username,
    };
  }
}
