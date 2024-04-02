import { Injectable } from '@nestjs/common';
import { startOfDay } from 'date-fns';
import { PrismaService } from 'src/lib/prisma.service';
import { SupabaseService } from 'src/lib/supabase.service';

@Injectable()
export class EventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async getEvents(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId,
      },
    });

    const joinedSigs = await this.prismaService.member.findMany({
      where: {
        userId: user.id,
      },
    });

    const joinedSigIds = joinedSigs.map((sig) => sig.interestGroupId);

    const events = await this.prismaService.event.findMany({
      where: {
        schedule: {
          gt: startOfDay(new Date()),
        },
        interestGroupId: {
          in: joinedSigIds,
        },
      },
      include: {
        organization: true,
        EventParticipant: true,
      },
    });

    const eventResponse = events.map((event) => {
      if (
        event.EventParticipant.find(
          (participant) => participant.userId === user.id,
        )
      ) {
        return {
          ...event,
          organization: event.organization.name,
          isJoined: true,
        };
      }
      return {
        ...event,
        organization: event.organization.name,
        isJoined: false,
      };
    });

    // console.log(eventResponse);

    return eventResponse;
  }

  public async getEventById(userId: string, eventId: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId,
      },
    });

    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        EventParticipant: true,
        organization: true,
      },
    });

    const joinedUser = event.EventParticipant.find(
      (participant) => participant.userId === user.id,
    );

    return {
      ...event,
      organization: event.organization.name,
      isJoined: Boolean(joinedUser),
      paymentProofImageUrl: joinedUser ? joinedUser.paymentProofImageUrl : null,
      joinedCount: event.EventParticipant.length,
    };
  }

  public async getMyUpcomingEvents(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId,
      },
      include: {
        EventParticipant: true,
      },
    });

    const joinedEventIds = user.EventParticipant.map((event) => event.eventId);

    const joinedUpcomingEvents = await this.prismaService.event.findMany({
      where: {
        schedule: {
          gte: startOfDay(new Date()),
        },
        id: {
          in: joinedEventIds,
        },
      },
      include: {
        EventParticipant: true,
        organization: true,
      },
    });

    console.log(joinedUpcomingEvents);

    return joinedUpcomingEvents.map((event) => ({
      ...event,
      isJoined: true,
      organization: event.organization.name,
    }));
  }

  public async getMyPastEvents(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId,
      },
      include: {
        EventParticipant: true,
      },
    });

    const joinedEventIds = user.EventParticipant.map((event) => event.eventId);

    const joinedPastEvents = await this.prismaService.event.findMany({
      where: {
        schedule: startOfDay(new Date()),
        id: {
          in: joinedEventIds,
        },
      },
      include: {
        EventParticipant: true,
        organization: true,
      },
    });

    console.log(joinedPastEvents);

    return joinedPastEvents.map((event) => ({
      ...event,
      isJoined: true,
      organization: event.organization.name,
    }));
  }

  public async uploadPaymentAndJoinEvent(
    userId: string,
    eventId: number,
    paymentProof: Express.Multer.File,
  ) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId,
      },
    });

    const paymentProofImageUrl =
      await this.supabaseService.uploadToStorage(paymentProof);

    await this.prismaService.eventParticipant.create({
      data: {
        userId: user.id,
        eventId,
        paymentProofImageUrl: paymentProofImageUrl.data.publicUrl,
      },
    });
  }

  public async getEventJoinedUsers(eventId: number) {
    const participants = await this.prismaService.eventParticipant.findMany({
      where: {
        eventId,
      },
    });

    const participantIds = participants.map(
      (participant) => participant.userId,
    );

    const joinedUsers = await this.prismaService.user.findMany({
      where: {
        id: {
          in: participantIds,
        },
      },
    });

    console.log(joinedUsers);

    return joinedUsers;
  }
}
