import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './lib/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    AuthModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule {}
