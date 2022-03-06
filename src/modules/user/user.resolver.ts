import { Args, Context, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { FilteredUsersResponse } from 'models/responses/user/filtered-users-response.modal';
import { RequestFollowUserResponse } from 'models/responses/user/request-follow-user.response';
import { UnfollowUserResponse } from 'models/responses/user/unfollow-user.response copy';
import { UserFollowersResponse } from 'models/responses/user/user-followers-response.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { UsersResponse } from 'models/responses/user/users-response.model';
import { User } from 'models/user/user.model';
import { UserService } from 'modules/user/user.service';
import { UserUpdateInput } from './dto/user-update.input';
import { UserWhereInput } from './dto/user-where.input';
import type { MechaContext } from 'types/types';
import { Inject, UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from 'modules/auth/utils/guards';
import { FollowUserStatusResponse } from 'models/responses/user/follow-user-status.response';
import { UserFollowersFindInput } from './dto/user-followers-find.input';
import { AcceptFollowRequestResponse } from 'models/responses/user/accept-follow-user.response';
import { DenyFollowRequestResponse } from 'models/responses/user/deny-follow-user.response';
import { FilterUsersInput } from './dto/filter-users.input';
import { PUB_SUB } from 'modules/pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';

enum SUBSCRIPTION_EVENTS {
  followRequestSent = 'followRequestSent',
}

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GraphQLAuthGuard)
  @Query(() => UserResponse)
  async me(@Context() context: MechaContext): Promise<UserResponse> {
    return await this.userService.me(context);
  }

  @Mutation(() => Boolean)
  @UseGuards(GraphQLAuthGuard)
  async logout(@Context() context: MechaContext) {
    return await this.userService.logout(context);
  }

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
    @Args('input', { type: () => FilterUsersInput }) input: FilterUsersInput,
  ): Promise<FilteredUsersResponse> {
    return await this.userService.filterUsers(input);
  }

  @Query(() => UserFollowersResponse)
  async userFollowers(
    @Args('input', { type: () => UserFollowersFindInput }) input: UserFollowersFindInput,
  ): Promise<UserFollowersResponse> {
    return this.userService.userFollowers(input);
  }

  @Query(() => FollowUserStatusResponse)
  async followUserStatus(
    @Args('userId', { type: () => String }) userId: string,
    @Args('followerId', { type: () => String }) followerId: string,
  ): Promise<FollowUserStatusResponse> {
    return this.userService.followUserStatus(userId, followerId);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => UserResponse)
  async updateUser(
    @Args('where') where: UserWhereInput,
    @Args('data') data: UserUpdateInput,
  ): Promise<UserResponse> {
    return await this.userService.updateUser(where, data);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => RequestFollowUserResponse)
  async requestFollowUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('followerId', { type: () => String }) followerId: string,
  ): Promise<RequestFollowUserResponse> {
    // this.pubSub.publish(SUBSCRIPTION_EVENTS.followRequestSent, {
    //   userId: userId,
    //   followerId: followerId,
    // });
    // console.log('publish');
    return this.userService.requestFollowUser(userId, followerId);
  }

  // @Subscription(() => RequestFollowUserResponse)
  // async requestFollowUserSent() {
  //   console.log('subscription');
  //   return this.pubSub.asyncIterator(SUBSCRIPTION_EVENTS.followRequestSent);
  // }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => AcceptFollowRequestResponse)
  async acceptFollowRequest(
    @Args('userId', { type: () => String }) userId: string,
    @Args('followerId', { type: () => String }) followerId: string,
  ): Promise<AcceptFollowRequestResponse> {
    return this.userService.acceptFollowRequest(userId, followerId);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => DenyFollowRequestResponse)
  async denyFollowRequest(
    @Args('userId', { type: () => String }) userId: string,
    @Args('followerId', { type: () => String }) followerId: string,
  ): Promise<DenyFollowRequestResponse> {
    return this.userService.denyFollowRequest(userId, followerId);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => UnfollowUserResponse)
  async unfollowUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('followerId', { type: () => String }) followerId: string,
  ) {
    return this.userService.unfollowUser(userId, followerId);
  }
}
