import { Injectable } from '@nestjs/common';
import CreateUserDTO from './dto/createUserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from './types/userResponse.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(createUserDTO: CreateUserDTO): Promise<IUserResponse> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDTO);

    const savedUser = await this.userRepository.save(newUser);

    return this.generateUserResponse(savedUser);
  }

  generateToken(user: UserEntity): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  generateUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }
}
