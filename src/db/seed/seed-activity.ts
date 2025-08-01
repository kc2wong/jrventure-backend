import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle-schema';
const { AchievementSubmissionRoleEnum, ActivityStatusEnum } = schema;

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

const now = new Date();

const data = [
  {
    categoryOid: 1,
    nameEn: 'Central District Flag Selling',
    nameEnUpCase: 'CENTRAL DISTRICT FLAG SELLING',
    nameZhHant: '中西區賣旗',
    nameZhHans: null,
    description: '世界自然(荔枝角)赴會準備區 報告八三 E-8-12牌',
    participantGrade: 63,
    startDate: new Date('2025-04-12T00:00:00+08:00'),
    endDate: new Date('2025-04-12T00:00:00+08:00'),
    sharable: true,
    ratable: false,
    eCoin: 0,
    achievementSubmissionRole: AchievementSubmissionRoleEnum.student,
    status: ActivityStatusEnum.closed,
    createdByUserOid: 1,
    createdAt: now,
    updatedByUserOid: 1,
    updatedAt: now,
    version: 1,
  },
  {
    categoryOid: 2,
    nameEn: 'Outschool Sport Achievement',
    nameEnUpCase: 'OUTSCHOOL SPORT ACHIEVEMENT',
    nameZhHant: null,
    nameZhHans: null,
    description:
      'The achievement / prize from outschool competition from 2024-09-01 to 2025-07-15. 可用於2024 - 2025 學年內取得之運動獎狀, 必須上載獲獎照片以供老師審核',
    participantGrade: 63,
    startDate: new Date('2024-09-01T00:00:00+08:00'),
    endDate: new Date('2025-07-15T00:00:00+08:00'),
    sharable: true,
    ratable: false,
    eCoin: 2,
    achievementSubmissionRole: AchievementSubmissionRoleEnum.student,
    status: ActivityStatusEnum.open,
    createdByUserOid: 1,
    createdAt: now,
    updatedByUserOid: 1,
    updatedAt: now,
    version: 1,
  },
  {
    categoryOid: 3,
    nameEn: 'Conduct and Manner',
    nameEnUpCase: 'CONDUCT AND MANNER',
    nameZhHant: '品行',
    nameZhHans: null,
    description: 'Conduct and Manner (Term1)',
    participantGrade: 63,
    startDate: new Date('2024-10-01T00:00:00+08:00'),
    endDate: new Date('2024-11-30T00:00:00+08:00'),
    sharable: false,
    ratable: true,
    eCoin: 0,
    achievementSubmissionRole: AchievementSubmissionRoleEnum.teacher,
    status: ActivityStatusEnum.open,
    createdByUserOid: 1,
    createdAt: now,
    updatedByUserOid: 1,
    updatedAt: now,
    version: 1,
  },
  {
    categoryOid: 4,
    nameEn: 'Communication',
    nameEnUpCase: 'COMMUNICATION',
    nameZhHant: '溝通能力',
    nameZhHans: null,
    description:
      'Ability to impart & exchange info, experiences and idea (Term1)',
    participantGrade: 63,
    startDate: new Date('2024-10-01T00:00:00+08:00'),
    endDate: new Date('2024-11-30T00:00:00+08:00'),
    sharable: false,
    ratable: true,
    eCoin: 0,
    achievementSubmissionRole: AchievementSubmissionRoleEnum.teacher,
    status: ActivityStatusEnum.open,
    createdByUserOid: 1,
    createdAt: now,
    updatedByUserOid: 1,
    updatedAt: now,
    version: 1,
  },
  {
    categoryOid: 4,
    nameEn: 'Critical Thinking',
    nameEnUpCase: 'CRITICAL THINKING',
    nameZhHant: '慎思明辨',
    nameZhHans: null,
    description: 'Encompass the knowledge, skills and processes (Term1)',
    participantGrade: 63,
    startDate: new Date('2024-10-01T00:00:00+08:00'),
    endDate: new Date('2024-11-30T00:00:00+08:00'),
    sharable: false,
    ratable: true,
    eCoin: 0,
    achievementSubmissionRole: AchievementSubmissionRoleEnum.teacher,
    status: ActivityStatusEnum.open,
    createdByUserOid: 1,
    createdAt: now,
    updatedByUserOid: 1,
    updatedAt: now,
    version: 1,
  },
  {
    categoryOid: 1,
    nameEn: 'Mid-Autumn Elderly Visit',
    nameEnUpCase: 'MID-AUTUMN ELDERLY VISIT',
    nameZhHant: '中秋探訪獨居老人',
    nameZhHans: null,
    description:
      '探訪杏福型已地區一老人及區民老師一同進行—慰問、玩遊戲、送禮物',
    participantGrade: 16, // P5 only (bit 4)
    startDate: new Date('2025-10-03T00:00:00+08:00'),
    endDate: new Date('2025-10-03T00:00:00+08:00'),
    sharable: true,
    ratable: false,
    eCoin: 1,
    achievementSubmissionRole: AchievementSubmissionRoleEnum.both,
    status: ActivityStatusEnum.scheduled,
    createdByUserOid: 1,
    createdAt: now,
    updatedByUserOid: 1,
    updatedAt: now,
    version: 1,
  },
  {
    categoryOid: 5,
    nameEn: 'HKICF2025',
    nameEnUpCase: 'HKICF2025',
    nameZhHant: null,
    nameZhHans: null,
    description: 'Hong Kong Inter-School Choral Festival 香港校際音樂節合唱隊',
    participantGrade: 63,
    startDate: new Date('2025-06-27T00:00:00+08:00'),
    endDate: new Date('2025-06-27T00:00:00+08:00'),
    sharable: true,
    ratable: false,
    eCoin: 2,
    achievementSubmissionRole: AchievementSubmissionRoleEnum.both,
    status: ActivityStatusEnum.scheduled,
    createdByUserOid: 1,
    createdAt: now,
    updatedByUserOid: 1,
    updatedAt: now,
    version: 1,
  },
];

async function main() {
  await client.connect();
  const db = drizzle(client, { schema });

  await db.insert(schema.activities).values(data);

  console.log('Seed data successfully added!');
  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  await client.end();
});
