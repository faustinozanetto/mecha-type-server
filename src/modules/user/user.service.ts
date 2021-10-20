import { Injectable } from '@nestjs/common';
import { AuthProvider, User, UserBadge, UserFilterBy } from 'models/user/user.model';
import { UserWhereInput } from 'modules/user/dto/user-where.input';
import { UserUpdateInput } from 'modules/user/dto/user-update.input';
import { TestLanguage, TestPreset, TestType } from 'models/test-preset/test-preset.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { UsersResponse } from 'models/responses/user/users-response.model';
import { calculateAverage } from 'utils/helper-functions';
import { FilteredUsersResponse } from 'models/responses/user/filtered-users-response.modal';
import { FilteredUser } from 'models/user/filtered-user';
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
    const user = await this.prisma.user.findUnique({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where: { id: context.req.session.passport.user.id },
      include: { testPresetHistory: true },
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
    };
    return { user: parsedUser };
  }

  async logout(context: MechaContext): Promise<boolean> {
    return new Promise((resolve) =>
      context.req.session.destroy((err) => {
        context.res.clearCookie('connect.sid');
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      }),
    );
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

  async filterUsers(page: number, filterBy: UserFilterBy): Promise<FilteredUsersResponse> {
    if (page < 0) {
      return {
        errors: [
          {
            field: 'page',
            message: 'Invalid page parameter',
          },
        ],
      };
    }
    const PAGE_SIZE = 10;
    const filteredUsers: FilteredUser[] = [];

    switch (filterBy) {
      case UserFilterBy.ACCURACY: {
        const users = await this.prisma.user.findMany({
          skip: page * PAGE_SIZE,
          take: PAGE_SIZE,
          where: {},
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            testPresetHistory: true,
          },
        });

        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = calculateAverage(
            user.testPresetHistory.map((entry) => entry.accuracy),
          );
          // Create entry with name and average.
          filteredUsers.push({
            ...user,
            value: averageField,
            authProvider:
              user.authProvider === 'DEFAULT'
                ? AuthProvider.DEFAULT
                : user.authProvider === 'DISCORD'
                ? AuthProvider.DISCORD
                : user.authProvider === 'GITHUB'
                ? AuthProvider.GITHUB
                : AuthProvider.GOOGLE,
          });
        });
        // Sorting
        filteredUsers.sort((a, b) => b.value - a.value);
        break;
      }
      case UserFilterBy.WPM: {
        const users = await this.prisma.user.findMany({
          skip: page * PAGE_SIZE,
          take: PAGE_SIZE,
          where: {},
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            testPresetHistory: true,
          },
        });
        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = calculateAverage(user.testPresetHistory.map((entry) => entry.wpm));
          // Create entry with name and average.
          filteredUsers.push({
            ...user,
            value: averageField,
            authProvider:
              user.authProvider === 'DEFAULT'
                ? AuthProvider.DEFAULT
                : user.authProvider === 'DISCORD'
                ? AuthProvider.DISCORD
                : user.authProvider === 'GITHUB'
                ? AuthProvider.GITHUB
                : AuthProvider.GOOGLE,
          });
        });
        // Sorting
        filteredUsers.sort((a, b) => b.value - a.value);
        break;
      }
      case UserFilterBy.CPM: {
        const users = await this.prisma.user.findMany({
          skip: page * PAGE_SIZE,
          take: PAGE_SIZE,
          where: {},
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            testPresetHistory: true,
          },
        });
        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = calculateAverage(user.testPresetHistory.map((entry) => entry.cpm));
          // Create entry with name and average.
          filteredUsers.push({
            ...user,
            value: averageField,
            authProvider:
              user.authProvider === 'DEFAULT'
                ? AuthProvider.DEFAULT
                : user.authProvider === 'DISCORD'
                ? AuthProvider.DISCORD
                : user.authProvider === 'GITHUB'
                ? AuthProvider.GITHUB
                : AuthProvider.GOOGLE,
          });
        });
        // Sorting
        filteredUsers.sort((a, b) => b.value - a.value);
        break;
      }
      case UserFilterBy.KEYSTROKES: {
        const users = await this.prisma.user.findMany({
          skip: page * PAGE_SIZE,
          take: PAGE_SIZE,
          where: {},
          orderBy: {
            createdAt: 'desc',
          },
          include: { testPresetHistory: true },
        });
        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = calculateAverage(
            user.testPresetHistory.map((entry) => entry.keystrokes),
          );
          // Create entry with name and average.
          filteredUsers.push({
            ...user,
            value: averageField,
            authProvider:
              user.authProvider === 'DEFAULT'
                ? AuthProvider.DEFAULT
                : user.authProvider === 'DISCORD'
                ? AuthProvider.DISCORD
                : user.authProvider === 'GITHUB'
                ? AuthProvider.GITHUB
                : AuthProvider.GOOGLE,
          });
        });
        // Sorting
        filteredUsers.sort((a, b) => b.value - a.value);
        break;
      }
      case UserFilterBy.TESTSCOMPLETED: {
        const users = await this.prisma.user.findMany({
          skip: page * PAGE_SIZE,
          take: PAGE_SIZE,
          where: {},
          orderBy: {
            createdAt: 'desc',
          },
          include: { testPresetHistory: true },
        });
        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = user.testPresetHistory.length;
          // Create entry with name and average.
          filteredUsers.push({
            ...user,
            value: averageField,
            authProvider:
              user.authProvider === 'DEFAULT'
                ? AuthProvider.DEFAULT
                : user.authProvider === 'DISCORD'
                ? AuthProvider.DISCORD
                : user.authProvider === 'GITHUB'
                ? AuthProvider.GITHUB
                : AuthProvider.GOOGLE,
          });
        });
        // Sorting
        filteredUsers.sort((a, b) => b.value - a.value);
        break;
      }
    }

    if (!filteredUsers) {
      return {
        errors: [
          {
            field: 'filteredUsers',
            message: 'An error occurred while trying to fetch users.',
          },
        ],
      };
    }
    const nodeCount = filteredUsers.length;
    const pageCount = Math.ceil(nodeCount / PAGE_SIZE);
    const currentPage = (page * PAGE_SIZE) / PAGE_SIZE;
    const hasMore = currentPage !== pageCount;

    return {
      nodes: filteredUsers,
      nodeCount,
      pageCount,
      currentPage,
      hasMore,
      nodesPerPage: PAGE_SIZE,
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
