import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSigsDTO } from './dto/update-sigs.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserID } from './user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/sigs')
  @UseGuards(AuthGuard)
  public async getJoinedSigs(@UserID() userId: string) {
    return await this.userService.getJoinedSigs(userId);
  }

  @Patch('/sigs')
  @UseGuards(AuthGuard)
  public async updateJoinedSigs(
    @UserID() userId: string,
    @Body() updateSigsDTO: UpdateSigsDTO,
  ) {
    return await this.userService.updateJoinedSigs(userId, updateSigsDTO);
  }
}
