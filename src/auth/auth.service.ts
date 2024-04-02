import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private saltRounds = 10;

  public async registerUser(registerUserDTO: RegisterUserDTO) {
    const { email, name, password } = registerUserDTO;

    console.log(registerUserDTO);

    const userWithSameEmail = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new UnprocessableEntityException('email has already been used');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    await this.prismaService.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return await this.login({ email, password });
  }

  public async login(loginUserDTO: LoginUserDTO) {
    const { email, password } = loginUserDTO;

    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException('wrong credentials');
    }

    const passwordIsCorrect = bcrypt.compareSync(password, user.password);

    if (!passwordIsCorrect) {
      throw new UnprocessableEntityException('wrong credentials');
    }

    const token = await this.jwtService.signAsync({
      userId: user.userId,
    });

    return {
      ...user,
      token,
    };
  }
}
