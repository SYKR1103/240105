import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newuser = await this.userRepo.create(createUserDto);
    await this.userRepo.save(newuser);
    return newuser;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new HttpException('xxx', HttpStatus.NOT_FOUND);
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new HttpException('xxx', HttpStatus.NOT_FOUND);
    return user;
  }
}
