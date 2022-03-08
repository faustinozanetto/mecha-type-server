import { Injectable } from '@nestjs/common';
import { AuthProvider, User, UserBadge } from 'models/user/user.model';
import { UserWhereInput } from 'modules/user/dto/user-where.input';
import { UserUpdateInput } from 'modules/user/dto/user-update.input';
import { TestLanguage, TestPreset, TestType } from 'models/test-preset/test-preset.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { UsersResponse } from 'models/responses/user/users-response.model';
import {
  FilteredUsersEdge,
  FilteredUsersResponse,
} from 'models/responses/user/filtered-users-response.modal';
import {
  UserFollowerEdge,
  UserFollowersResponse,
} from 'models/responses/user/user-followers-response.model';
import { RequestFollowUserResponse } from 'models/responses/user/request-follow-user.response';
import { UnfollowUserResponse } from 'models/responses/user/unfollow-user.response copy';
import { MechaContext } from 'types/types';
import { PrismaService } from 'nestjs-prisma';
import {
  FollowRequestStatus,
  FollowUserStatusResponse,
} from 'models/responses/user/follow-user-status.response';
import { UserFollowersFindInput } from './dto/user-followers-find.input';
import { FollowStatus } from '.prisma/client';
import { AcceptFollowRequestResponse } from 'models/responses/user/accept-follow-user.response';
import { DenyFollowRequestResponse } from 'models/responses/user/deny-follow-user.response';
import { FilterUsersInput } from './dto/filter-users.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param request Request param to retrieve current user from.
   * @returns The user response containing the user and or errors.
   */
  async me(context: MechaContext): Promise<UserResponse> {
    if (!context.req) {
      return {
        errors: [
          {
            field: 'user',
            message: 'An error ocurred',
          },
        ],
      };
    }

    const userID: string = context.req.session.passport.user;
    const user = await this.prisma.user.findUnique({
      where: { id: userID },
      // include: { testPresetHistory: true, testPresets: true },
    });

    if (user) {
      // const parsedPresets: TestPreset[] = user?.testPresets.map((preset) => {
      //   return {
      //     ...preset,
      //     type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
      //     language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
      //   };
      // });
      const parsedUser: User = {
        ...user,
        // testPresets: parsedPresets,
        badge:
          user.badge === 'DEFAULT'
            ? UserBadge.DEFAULT
            : user.badge === 'PRO'
            ? UserBadge.PRO
            : UserBadge.TESTER,
        authProvider:
          user.authProvider === 'DEFAULT'
            ? AuthProvider.DEFAULT
            : user.authProvider === 'DISCORD'
            ? AuthProvider.DISCORD
            : user.authProvider === 'GITHUB'
            ? AuthProvider.GITHUB
            : AuthProvider.GOOGLE,
      };
      return { user: parsedUser };
    } else {
      return {
        user: null,
        errors: [
          {
            field: 'user',
            message: 'An error occurred',
          },
        ],
      };
    }
  }

  async logout(context: MechaContext) {
    try {
      context.req.logOut();
    } catch (e) {}
  }

  /**
   * @param where Where parameter to filter the user.
   * @returns The user response containing the user and or errors.
   */
  async user(where: UserWhereInput): Promise<UserResponse> {
    if (!where.id && !where.username) {
      return {
        errors: [{ field: 'where', message: 'where parameter not specified' }],
      };
    }
    const user = await this.prisma.user.findUnique({
      where,
      include: {
        testPresetHistory: true,
        testPresets: true,
      },
    });

    if (!user) {
      return {
        errors: [{ field: 'user', message: 'An error occurred while searching for user' }],
      };
    }

    if (user?.id !== undefined) {
      const parsedPresets: TestPreset[] = user?.testPresets.map((preset) => {
        return {
          ...preset,
          type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
          language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
        };
      });

      const parsedUser: User = {
        ...user,
        badge:
          user.badge === 'DEFAULT'
            ? UserBadge.DEFAULT
            : user.badge === 'PRO'
            ? UserBadge.PRO
            : UserBadge.TESTER,
        authProvider:
          user.authProvider === 'DEFAULT'
            ? AuthProvider.DEFAULT
            : user.authProvider === 'DISCORD'
            ? AuthProvider.DISCORD
            : user.authProvider === 'GITHUB'
            ? AuthProvider.GITHUB
            : AuthProvider.GOOGLE,
        testPresets: parsedPresets,
      };

      return { user: parsedUser };
    }
  }

  async users(take: number): Promise<UsersResponse> {
    if (!take) {
      return {
        errors: [
          {
            field: 'take',
            message: 'Invalid take parameter',
          },
        ],
      };
    }

    const users = await this.prisma.user.findMany({
      take,
      where: {},
    });
    if (!users) {
      return {
        errors: [
          {
            field: 'users',
            message: 'An error occurred while trying to fetch users.',
          },
        ],
      };
    }
    const parsedUsers = users.map((user) => {
      return {
        ...user,
        badge:
          user.badge === 'DEFAULT'
            ? UserBadge.DEFAULT
            : user.badge === 'PRO'
            ? UserBadge.PRO
            : UserBadge.TESTER,
        authProvider:
          user.authProvider === 'DEFAULT'
            ? AuthProvider.DEFAULT
            : user.authProvider === 'DISCORD'
            ? AuthProvider.DISCORD
            : user.authProvider === 'GITHUB'
            ? AuthProvider.GITHUB
            : AuthProvider.GOOGLE,
      };
    });

    return {
      users: parsedUsers,
    };
  }

  async filterUsers(input: FilterUsersInput): Promise<FilteredUsersResponse> {
    const users = await this.prisma.user.findMany({
      take: input.take,
      skip: input.skip,
      where: {},
      orderBy: { createdAt: 'desc' },
      include: { testPresetHistory: true },
    });
    if (!users.length) {
      /**
       * this will occur in two (2) scenarios
       *  a) client error, pageInfo was not respected when making request
       *  b) there are no posts matching query
       */
      return {
        count: 0,
        edges: [],
        pageInfo: {
          hasMore: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }
    // Calculating if there are more followers or not.
    const hasMore = Boolean(
      await this.prisma.user.count({
        take: 1,
        where: {
          createdAt: { lt: users[users.length - 1].createdAt },
        },
      }),
    );
    // Mapping the edges.
    const edges = users.map((node) => ({
      cursor: node.createdAt,
      node,
    }));
    // Mapping and parsing the followers due to miss match of types.
    const mapped: FilteredUsersEdge[] = edges.map((edge) => {
      return {
        cursor: edge.cursor,
        node: {
          ...edge.node,
          value: 0,
          badge:
            edge.node.badge === 'DEFAULT'
              ? UserBadge.DEFAULT
              : edge.node.badge === 'PRO'
              ? UserBadge.PRO
              : UserBadge.TESTER,
          authProvider:
            edge.node.authProvider === 'DEFAULT'
              ? AuthProvider.DEFAULT
              : edge.node.authProvider === 'DISCORD'
              ? AuthProvider.DISCORD
              : edge.node.authProvider === 'GITHUB'
              ? AuthProvider.GITHUB
              : AuthProvider.GOOGLE,
        },
      };
    });

    return {
      count: edges.length,
      edges: mapped,
      pageInfo: {
        hasMore,
        startCursor: edges[0].cursor,
        endCursor: edges[edges.length - 1].cursor,
      },
    };
  }

  async updateUser(where: UserWhereInput, data: UserUpdateInput): Promise<UserResponse> {
    if (!where || !data) {
      return {
        errors: [
          {
            field: 'input',
            message: 'Input is invalid',
          },
        ],
      };
    }

    // Updating the user
    const updatedUser = await this.prisma.user.update({
      where,
      data: {
        username: data.name,
        description: data.description,
        avatar: data.image,
        country: data.country,
        badge: data.badge,
      },
      include: {
        testPresets: true,
      },
    });

    // If an error ocurred we return error
    if (!updatedUser) {
      return {
        errors: [
          {
            field: 'updatedUser',
            message: 'An error ocurred while trying to update user.',
          },
        ],
      };
    }

    const parsedPresets: TestPreset[] = updatedUser.testPresets.map((preset) => {
      return {
        ...preset,
        type: preset.type === 'TIME' ? TestType.TIME : TestType.WORDS,
        language: preset.language === 'ENGLISH' ? TestLanguage.ENGLISH : TestLanguage.SPANISH,
      };
    });

    const parsedUser: User = {
      ...updatedUser,
      badge:
        updatedUser.badge === 'DEFAULT'
          ? UserBadge.DEFAULT
          : updatedUser.badge === 'PRO'
          ? UserBadge.PRO
          : UserBadge.TESTER,
      authProvider:
        updatedUser.authProvider === 'DEFAULT'
          ? AuthProvider.DEFAULT
          : updatedUser.authProvider === 'DISCORD'
          ? AuthProvider.DISCORD
          : updatedUser.authProvider === 'GITHUB'
          ? AuthProvider.GITHUB
          : AuthProvider.GOOGLE,
      testPresets: parsedPresets,
    };

    return { user: parsedUser };
  }

  async userFollowers(input: UserFollowersFindInput): Promise<UserFollowersResponse> {
    // Fetching followers
    const totalAcceptedRequests = await this.prisma.follow.count({
      where: { status: FollowStatus.ACCEPTED, userId: input.where.id },
    });
    const totalPendingRequests = await this.prisma.follow.count({
      where: { status: FollowStatus.PENDING, userId: input.where.id },
    });

    const followers = await this.prisma.follow.findMany({
      take: input.take,
      skip: input.skip,
      where: {
        user: input.where,
      },
      include: { follower: true },
      orderBy: { createdAt: 'desc' },
    });
    if (!followers.length) {
      /**
       * this will occur in two (2) scenarios
       *  a) client error, pageInfo was not respected when making request
       *  b) there are no posts matching query
       */
      return {
        count: 0,
        acceptedRequests: 0,
        pendingRequests: 0,
        edges: [],
        pageInfo: {
          hasMore: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }
    // Calculating if there are more followers or not.
    const hasMore = Boolean(
      await this.prisma.follow.count({
        take: 1,
        where: {
          createdAt: { lt: followers[followers.length - 1].createdAt },
        },
      }),
    );
    // Mapping the edges.
    const edges = followers.map((node) => ({
      cursor: node.createdAt,
      node,
    }));

    // Mapping and parsing the followers due to miss match of types.
    const mapped: UserFollowerEdge[] = edges.map((edge) => {
      return {
        cursor: edge.cursor,
        node: {
          ...edge.node.follower,
          status:
            edge.node.status === FollowStatus.ACCEPTED
              ? FollowRequestStatus.ACCEPTED
              : edge.node.status === FollowStatus.PENDING
              ? FollowRequestStatus.PENDING
              : FollowRequestStatus.REJECTED,
          authProvider:
            edge.node.follower.authProvider === 'DEFAULT'
              ? AuthProvider.DEFAULT
              : edge.node.follower.authProvider === 'DISCORD'
              ? AuthProvider.DISCORD
              : edge.node.follower.authProvider === 'GITHUB'
              ? AuthProvider.GITHUB
              : AuthProvider.GOOGLE,
        },
      };
    });
    return {
      count: edges.length,
      acceptedRequests: totalAcceptedRequests,
      pendingRequests: totalPendingRequests,
      edges: mapped,
      pageInfo: {
        hasMore,
        startCursor: edges[0].cursor,
        endCursor: edges[edges.length - 1].cursor,
      },
    };
  }

  async requestFollowUser(userId: string, followerId: string): Promise<RequestFollowUserResponse> {
    if (userId === '' || followerId === '') {
      return {
        errors: [
          {
            field: 'id',
            message: 'invalid input',
          },
        ],
      };
    }
    try {
      const followRelation = await this.prisma.follow.create({
        data: {
          status: FollowStatus.PENDING,
          user: {
            connect: {
              id: userId,
            },
          },
          follower: {
            connect: {
              id: followerId,
            },
          },
        },
      });
      return {
        requestSent: followRelation.id !== undefined,
      };
    } catch (error) {
      return { errors: [{ field: 'error', message: 'An error occurred' }] };
    }
  }

  async acceptFollowRequest(
    userId: string,
    followerId: string,
  ): Promise<AcceptFollowRequestResponse> {
    try {
      const petition = await this.prisma.follow.update({
        where: { userId_followerId: { userId, followerId } },
        data: { status: FollowStatus.ACCEPTED },
      });
      return { accepted: petition.status === FollowStatus.ACCEPTED };
    } catch (error) {
      return { errors: [{ field: 'error', message: 'An error occurred' }] };
    }
  }

  async denyFollowRequest(userId: string, followerId: string): Promise<DenyFollowRequestResponse> {
    try {
      await this.prisma.follow.delete({
        where: { userId_followerId: { userId, followerId } },
      });
      return { denied: true };
    } catch (error) {
      return { errors: [{ field: 'error', message: 'An error occurred' }] };
    }
  }

  async unfollowUser(userId: string, followerId: string): Promise<UnfollowUserResponse> {
    try {
      await this.prisma.follow.delete({
        where: { userId_followerId: { userId, followerId } },
      });
      return { unfollow: true };
    } catch (error) {
      return { errors: [{ field: 'error', message: 'An error occurred' }] };
    }
  }

  async followUserStatus(userId: string, followerId: string): Promise<FollowUserStatusResponse> {
    try {
      const follows = await this.prisma.follow.findUnique({
        where: {
          userId_followerId: { userId, followerId },
        },
      });
      if (follows && follows.followerId) {
        return {
          status:
            follows.status === FollowStatus.ACCEPTED
              ? FollowRequestStatus.ACCEPTED
              : follows.status === FollowStatus.PENDING
              ? FollowRequestStatus.PENDING
              : FollowRequestStatus.REJECTED,
        };
      }
    } catch (error) {
      return { errors: [{ field: 'error', message: 'An error occurred' }] };
    }
    return {
      status: FollowRequestStatus.NOTSENT,
    };
  }
}
