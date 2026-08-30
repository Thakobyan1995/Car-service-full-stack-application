import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserLoginDTO } from './dto/userDTO';
import { IUserResponse } from './types/userResponse.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async registerUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<IUserResponse> {
    return await this.userService.registerUser(createUserDTO);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() userData: UserLoginDTO): Promise<any> {
    return await this.userService.login(userData);
  }
}
