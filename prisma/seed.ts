import { PrismaClient, AuthProvider } from '@prisma/client';
import { datatype } from 'faker';
import { TestLanguage, TestType } from '../src/models/test-preset/test-preset.model';

const prisma = new PrismaClient();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  /*
  const ids = await prisma.user.findMany({
    where: { authProvider: AuthProvider.DEFAULT },
    select: { id: true },
  });
  
  // Loop through all the users
  for (const user of ids) {
    // Create 5 Test Preset History entry per user.
    // Get the list of ids minus the current user id
    const excludedIds = ids.filter((id) => id.id !== user.id);
    const followerIds = [];
    for (let i = 0; i < 5; i++) {
      await prisma.testPresetHistory.create({
        data: {
          user: { connect: { id: user.id } },
          wpm: datatype.number(120),
          cpm: datatype.number(600),
          accuracy: datatype.number(100),
          correctChars: 50,
          incorrectChars: 50,
          keystrokes: datatype.number(300),
          testPreset: { connect: { id: 'ckuvsbhm60124aoi380k944fb' } },
        },
      });
      const filtered = excludedIds.filter((el) => !followerIds.includes(el));
      const followerId = filtered[getRandomInt(0, excludedIds.length)].id;
      followerIds.push(followerId);
      try {
        await prisma.follow.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
            follower: {
              connect: {
                id: followerId,
              },
            },
          },
        });
      } catch (e) {}
    }
    console.log(followerIds);
  }
  console.log(ids);
  */
  const generateRandomLanguage = (): TestLanguage => {
    return getRandomInt(0, 1) === 1 ? TestLanguage.ENGLISH : TestLanguage.SPANISH;
  };
  for (let i = 0; i < 300; i++) {
    const testPreset = await prisma.testPreset.create({
      data: {
        language: generateRandomLanguage(),
        type: TestType.WORDS,
        words: getRandomInt(10, 120),
        punctuated: datatype.boolean(),
        creatorImage: 'https://i.imgur.com/xuIzYtW.png',
        time: 0,
      },
    });
    console.log(testPreset);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
