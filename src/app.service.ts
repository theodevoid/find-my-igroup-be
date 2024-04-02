import { Injectable } from '@nestjs/common';
import { PrismaService } from './lib/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
