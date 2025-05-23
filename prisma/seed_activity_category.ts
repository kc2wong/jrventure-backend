// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { ActivityCategory } from '@prisma/client';

const data: Omit<ActivityCategory, 'oid'>[] = [
  {
    code: 'SOC',
    name_en: 'Social Service',
    name_zh_hant: '社區服務',
    name_zh_hans: '社区服务',
  },
  {
    code: 'SPT',
    name_en: 'Sports',
    name_zh_hant: '體育運動',
    name_zh_hans: '体育运动',
  },
  {
    code: 'CMT',
    name_en: 'Classroom Mgmt',
    name_zh_hant: '課堂管理',
    name_zh_hans: '课堂管理',
  },
  {
    code: 'STC',
    name_en: 'Student Competency',
    name_zh_hant: '學生能力',
    name_zh_hans: '学生能力',
  },
  {
    code: 'MUS',
    name_en: 'Music',
    name_zh_hant: '音樂活動',
    name_zh_hans: '音乐活动',
  },
];

async function main() {
  const now = new Date();
  await prisma.activityCategory.createMany({ data });

  console.log('Seed data successfully added!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
