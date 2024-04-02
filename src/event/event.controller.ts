import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserID } from 'src/user/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @UseGuards(AuthGuard)
  public async getEvents(@UserID() userId: string) {
    return await this.eventService.getEvents(userId);
  }

  @Get('/:eventId')
  @UseGuards(AuthGuard)
  public async getEventById(
    @UserID() userId: string,
    @Param('eventId') eventId: number,
  ) {
    return await this.eventService.getEventById(userId, eventId);
  }

  @Get('/:eventId/members')
  public async getEventMembers(@Param('eventId') eventId: number) {
    return await this.eventService.getEventJoinedUsers(eventId);
  }

  @Get('/me/upcoming')
  @UseGuards(AuthGuard)
  public async getMyUpcomingEvents(@UserID() userId: string) {
    return await this.eventService.getMyUpcomingEvents(userId);
  }

  @Get('/me/past')
  @UseGuards(AuthGuard)
  public async getMyPastEvents(@UserID() userId: string) {
    return await this.eventService.getMyPastEvents(userId);
  }

  @Post('/:eventId/payment')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('payment_proof_image'))
  public async uploadPaymentAndJoinEvent(
    @UserID() userId: string,
    @Param('eventId') eventId: number,
    @UploadedFile() paymentProofFile: Express.Multer.File,
  ) {
    console.log({
      userId,
      eventId,
      paymentProofFile,
    });
    return await this.eventService.uploadPaymentAndJoinEvent(
      userId,
      eventId,
      paymentProofFile,
    );
  }
}
