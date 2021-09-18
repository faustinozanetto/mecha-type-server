import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FilteredUsersResponse } from 'models/responses/user/filtered-users-response.modal';
import { FollowUserResponse } from 'models/responses/user/follow-user.response';
import { UnfollowUserResponse } from 'models/responses/user/unfollow-user.response copy';
import { UserFollowersResponse } from 'models/responses/user/user-followers-response.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { UsersResponse } from 'models/responses/user/users-response.model';
import { User, UserFilterBy } from 'models/user/user.model';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'services/user.service';
import { UserUpdateInput } from './dto/user-update.input';
import { UserWhereInput } from './dto/user-where.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private prisma: PrismaService) {}

  @Query(() => UserResponse)
  async user(
    @Args('where', { type: () => UserWhereInput }) where: UserWhereInput,
  ): Promise<UserResponse> {
    return await this.userService.user(where);
  }

  @Query(() => UsersResponse)
  async users(@Args('take', { type: () => Int }) take: number): Promise<UsersResponse> {
    return await this.userService.users(take);
  }

  @Query(() => FilteredUsersResponse)
  async filterUsers(
    @Args('take', { type: () => Int }) take: number,
    @Args('filterBy', { type: () => UserFilterBy }) filterBy: UserFilterBy,
  ): Promise<FilteredUsersResponse> {
    return await this.userService.filterUsers(take, filterBy);
  }

  @Query(() => UserFollowersResponse)
  async userFollowers(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<UserFollowersResponse> {
    return this.userService.userFollowers(userId);
  }

  @Query(() => Boolean)
  async followsUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('targetUserId', { type: () => String }) targetUserId: string,
  ) {
    return this.userService.followsUser(userId, targetUserId);
  }

  @Mutation(() => UserResponse)
  async updateUser(
    @Args('where') where: UserWhereInput,
    @Args('data') data: UserUpdateInput,
    @Context() { req },
  ): Promise<UserResponse> {
    return await this.userService.updateUser(where, data, req);
  }

  @Mutation(() => FollowUserResponse)
  async followUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('targetUserId', { type: () => String }) targetUserId: string,
    @Context() { req },
  ) {
    return this.userService.followUser(userId, targetUserId, req);
  }

  @Mutation(() => UnfollowUserResponse)
  async unfollowUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('targetUserId', { type: () => String }) targetUserId: string,
    @Context() { req },
  ) {
    return this.userService.unfollowUser(userId, targetUserId, req);
  }
}
