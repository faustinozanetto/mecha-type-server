import { Module } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';
import { UserService } from 'services/user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [PrismaService],
  providers: [PrismaService, UserResolver, UserService],
})
export class UserModule {}
