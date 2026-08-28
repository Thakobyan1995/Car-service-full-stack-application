import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDTO from './dto/createUserDTO';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() createUserDTO: CreateUserDTO): Promise<any> {
    return await this.userService.registerUser(createUserDTO);
  }
}
