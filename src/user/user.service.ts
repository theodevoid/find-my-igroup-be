import { Injectable } from '@nestjs/common';
import { UpdateSigsDTO } from './dto/update-sigs.dto';
import { PrismaService } from 'src/lib/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getJoinedSigs(userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId,
      },
    });

    const sigs = await this.prismaService.member.findMany({
      where: {
        userId: user.id,
      },
    });

    const sigIds = sigs.map((sig) => sig.interestGroupId);

    const joinedSigs = await this.prismaService.interestGroup.findMany({
      where: {
        id: {
          in: sigIds,
        },
      },
    });

    return joinedSigs;
  }

  public async updateJoinedSigs(userId: string, updateSigsDTO: UpdateSigsDTO) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId,
      },
    });

    await this.prismaService.member.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const newJoinedSigs: Prisma.MemberCreateManyInput[] =
      updateSigsDTO.sigIds.map((sigId) => {
        return {
          interestGroupId: sigId,
          userId: user.id,
        };
      });

    await this.prismaService.member.createMany({
      data: newJoinedSigs,
    });
  }
}
