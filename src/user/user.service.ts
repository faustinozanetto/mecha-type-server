import { Inject, Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthProvider, User, UserBadge, UserFilterBy } from 'models/user/user.model';
import { UserWhereInput } from 'user/dto/user-where.input';
import { UserUpdateInput } from 'user/dto/user-update.input';
import { TestLanguage, TestPreset, TestType } from 'models/test-preset/test-preset.model';
import { UserResponse } from 'models/responses/user/user-response.model';
import { UsersResponse } from 'models/responses/user/users-response.model';
import { calculateAverage, validateAuthCookies } from 'utils/helper-functions';
import { FilteredUsersResponse } from 'models/responses/user/filtered-users-response.modal';
import { FilteredUser } from 'models/user/filtered-user';
import { UserFollowersResponse } from 'models/responses/user/user-followers-response.model';
import { UserFollower } from 'models/user/user-follower.model';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FollowUserResponse } from 'models/responses/user/follow-user.response';
import { UnfollowUserResponse } from 'models/responses/user/unfollow-user.response copy';

@Injectable()
@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(@Inject(REQUEST) private request: Request, private prisma: PrismaService) {}

  /**
   *
   * @param request Request param to retrieve current user from.
   * @returns The user response containing the user and or errors.
   */
  async me(request: Request): Promise<UserResponse> {
    if (!request) {
      return {
        errors: [
          {
            field: 'user',
            message: 'An error ocurred',
          },
        ],
      };
    }
    const user = request.user as User;
    return { user };
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
        accuracy: true,
        wordsPerMinute: true,
        charsPerMinute: true,
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
    const PAGE_SIZE = 2;
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
            accuracy: true,
          },
        });

        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = calculateAverage(user.accuracy.map((accuracy) => accuracy.amount));
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
            wordsPerMinute: true,
          },
        });
        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = calculateAverage(user.wordsPerMinute.map((wpm) => wpm.amount));
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
            charsPerMinute: true,
          },
        });
        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = calculateAverage(user.charsPerMinute.map((cpm) => cpm.amount));
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
        });
        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = user.keystrokes;
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
        });
        // Mapping for each user
        users.map((user) => {
          // Calculate average accuracy for user.
          const averageField = user.testsCompleted;
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

  async updateUser(
    where: UserWhereInput,
    data: UserUpdateInput,
    request: Request,
  ): Promise<UserResponse> {
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
    // Validating wether user is logged in or not.
    const validAuthCookie = validateAuthCookies(request);
    if (!validAuthCookie) {
      return {
        errors: [
          {
            field: 'auth',
            message: 'not authorized',
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
        keystrokes: data.keystrokes,
        testsCompleted: data.testsCompleted,
        badge: data.badge,
        wordsPerMinute: { create: [data.wordsPerMinute] },
        charsPerMinute: { create: [data.charsPerMinute] },
        accuracy: { create: [data.accuracy] },
      },
      include: {
        accuracy: true,
        wordsPerMinute: true,
        charsPerMinute: true,
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

  async userFollowers(userId: string): Promise<UserFollowersResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { following: true },
    });
    const followers: UserFollower[] = [];
    for (const entry of user.following) {
      const follower = await this.prisma.user.findUnique({
        where: { id: entry.parentId },
      });
      if (follower) {
        followers.push({
          ...follower,
          authProvider:
            follower.authProvider === 'DEFAULT'
              ? AuthProvider.DEFAULT
              : follower.authProvider === 'DISCORD'
              ? AuthProvider.DISCORD
              : follower.authProvider === 'GITHUB'
              ? AuthProvider.GITHUB
              : AuthProvider.GOOGLE,
        });
      }
    }
    return { users: followers };
  }

  async followUser(
    userId: string,
    targetUserId: string,
    request: Request,
  ): Promise<FollowUserResponse> {
    // Validating wether user is logged in or not.
    const validAuthCookie = validateAuthCookies(request);
    if (!validAuthCookie) {
      return {
        errors: [
          {
            field: 'auth',
            message: 'not authorized',
          },
        ],
      };
    }

    const exists = await this.prisma.userOnUser.findMany({
      where: {
        childId: targetUserId,
        parentId: userId,
      },
    });
    if (exists[0] && exists[0].id !== undefined) {
      return { follow: false };
    }
    const follow = await this.prisma.userOnUser.create({
      data: {
        parent: { connect: { id: userId } },
        child: { connect: { id: targetUserId } },
      },
    });
    return {
      follow: follow.id !== undefined,
    };
  }

  async unfollowUser(
    userId: string,
    targetUserId: string,
    request: Request,
  ): Promise<UnfollowUserResponse> {
    // Validating wether user is logged in or not.
    const validAuthCookie = validateAuthCookies(request);
    if (!validAuthCookie) {
      return {
        errors: [
          {
            field: 'auth',
            message: 'not authorized',
          },
        ],
      };
    }

    await this.prisma.userOnUser.deleteMany({
      where: {
        childId: targetUserId,
        parentId: userId,
      },
    });
    return { unfollow: true };
  }

  async followsUser(userId: string, targetUserId: string): Promise<boolean> {
    if (userId === undefined || targetUserId === undefined) return false;
    const follows = await this.prisma.userOnUser.findFirst({
      where: {
        childId: targetUserId,
        parentId: userId,
      },
    });
    if (follows && follows.id) {
      return true;
    }
    return false;
  }
}