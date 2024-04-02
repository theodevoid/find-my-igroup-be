import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() loginUserDTO: LoginUserDTO) {
    console.log(loginUserDTO);
    return await this.authService.login(loginUserDTO);
  }

  @Post('/register')
  public async register(@Body() registerUserDTO: RegisterUserDTO) {
    return await this.authService.registerUser(registerUserDTO);
  }
}
