import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/lib/prisma.service';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, AuthService],
})
export class AuthModule {}
