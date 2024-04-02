import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserID } from 'src/user/user.decorator';

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
}
