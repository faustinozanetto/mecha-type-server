import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
describe('Users Service ', () => {
  let userService: UserService;

  beforeEach(async () => {
    const UserServiceProvider = {
      provide: UserService,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('UserService - should be definred', () => {
    expect(userService).toBeDefined();
  });
});
