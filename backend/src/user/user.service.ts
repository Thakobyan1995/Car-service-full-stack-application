import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO, UserLoginDTO } from './dto/userDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from './types/userResponse.interface';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { returnUserSafely } from 'src/utils/returnUserSafely';

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

    const foundUserByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDTO.email,
      },
    });

    if (foundUserByEmail) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

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
        ...returnUserSafely(user),
        token: this.generateToken(user),
      },
    };
  }

  async login(userData: UserLoginDTO): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new HttpException(
        `Email or password is incorrect`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const match = await compare(userData.password, user.password);

    if (!match) {
      throw new HttpException(
        `Email or password is incorrect`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return returnUserSafely(user);
  }
}
