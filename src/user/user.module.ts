import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'user/user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [PrismaService],
  providers: [PrismaService, UserResolver, UserService],
})
export class UserModule {}