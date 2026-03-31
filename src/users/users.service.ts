import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

const users: User[] = [
  {
    userId: 1,
    username: 'john',
    password: 'changeme',
  },
  {
    userId: 2,
    username: 'maria',
    password: 'guess',
  },
];

@Injectable()
export class UsersService {
  async findUserByName(username: string): Promise<User | undefined> {
    return Promise.resolve(users.find((user) => user.username === username));
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newId = Math.max(...users.map((u) => u.userId)) + 1;
    const newUser: User = { ...userData, userId: newId };
    users.push(newUser);
    return Promise.resolve(newUser);
  }

  async findById(id: number): Promise<User | undefined> {
    return Promise.resolve(users.find((user) => user.userId === id));
  }
}
import { CreateUserDto } from './dto/create-user.dto';
