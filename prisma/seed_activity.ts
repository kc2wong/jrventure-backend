// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { Activity } from '@prisma/client';
const now = new Date();

const data: Omit<Activity, 'oid'>[] = [
  {
    category_oid: 1,
    name_en: 'Central District Flag Selling',
    name_en_up_case: 'Central District Flag Selling'.toUpperCase(),
    name_zh_hant: '中西區賣旗',
    name_zh_hans: null,
    description: '世界自然(荔枝角)赴會準備區 報告八三 E-8-12牌',
    participant_grade: 63,
    start_date: new Date('2025-04-12T00:00:00+08:00'),
    end_date: new Date('2025-04-12T00:00:00+08:00'),
    sharable: true,
    ratable: false,
    e_coin: 2,
    achievement_submission_role: 'Student',
    status: 'Closed',
    created_by_user_oid: 1,
    created_at: now,
    updated_by_user_oid: 1,
    updated_at: now,
    version: 1
  },
  {
    category_oid: 2,
    name_en: 'Outschool Sport Achievement',
    name_en_up_case: 'Outschool Sport Achievement'.toUpperCase(),
    name_zh_hant: null,
    name_zh_hans: null,
    description: 'The achievement / prize from outschool competition from 2024-09-01 to 2025-07-15. 可用於2024 - 2025 學年內取得之運動獎狀, 必須上載獲獎照片以供老師審核',
    participant_grade: 63,
    start_date: new Date('2024-09-01T00:00:00+08:00'),
    end_date: new Date('2025-07-15T00:00:00+08:00'),
    sharable: true,
    ratable: false,
    e_coin: 2,
    achievement_submission_role: 'Student',
    status: 'Open',
    created_by_user_oid: 1,
    created_at: now,
    updated_by_user_oid: 1,
    updated_at: now,
    version: 1
  },
  {
    category_oid: 3,
    name_en: 'Conduct and Manner',
    name_en_up_case: 'Conduct and Manner'.toUpperCase(),
    name_zh_hant: '品行',
    name_zh_hans: null,
    description: 'Conduct and Manner (Term1)',
    participant_grade: 63,
    start_date: new Date('2024-10-01T00:00:00+08:00'),
    end_date: new Date('2024-11-30T00:00:00+08:00'),
    sharable: false,
    ratable: true,
    e_coin: 0,
    achievement_submission_role: 'Teacher',
    status: 'Open',
    created_by_user_oid: 1,
    created_at: now,
    updated_by_user_oid: 1,
    updated_at: now,
    version: 1
  },
  {
    category_oid: 4,
    name_en: 'Communication',
    name_en_up_case: 'Communication'.toUpperCase(),
    name_zh_hant: '溝通能力',
    name_zh_hans: null,
    description: 'Ability to impart & exchange info, experiences and idea (Term1)',
    participant_grade: 63,
    start_date: new Date('2024-10-01T00:00:00+08:00'),
    end_date: new Date('2024-11-30T00:00:00+08:00'),
    sharable: false,
    ratable: true,
    e_coin: 0,
    achievement_submission_role: 'Teacher',
    status: 'Open',
    created_by_user_oid: 1,
    created_at: now,
    updated_by_user_oid: 1,
    updated_at: now,
    version: 1
  },
  {
    category_oid: 4,
    name_en: 'Critical Thinking',
    name_en_up_case: 'Critical Thinking'.toUpperCase(),
    name_zh_hant: '慎思明辨',
    name_zh_hans: null,
    description: 'Encompass the knowledge, skills and processes (Term1)',
    participant_grade: 63,
    start_date: new Date('2024-10-01T00:00:00+08:00'),
    end_date: new Date('2024-11-30T00:00:00+08:00'),
    sharable: false,
    ratable: true,
    e_coin: 0,
    achievement_submission_role: 'Teacher',
    status: 'Open',
    created_by_user_oid: 1,
    created_at: now,
    updated_by_user_oid: 1,
    updated_at: now,
    version: 1
  },
  {
    category_oid: 1,
    name_en: 'Mid-Autumn Elderly Visit',
    name_en_up_case: 'Mid-Autumn Elderly Visit'.toUpperCase(),
    name_zh_hant: '中秋探訪獨居老人',
    name_zh_hans: null,
    description: '探訪杏福型已地區一老人及區民老師一同進行—慰問、玩遊戲、送禮物',
    participant_grade: 16, // P5 only (bit 4)
    start_date: new Date('2025-10-03T00:00:00+08:00'),
    end_date: new Date('2025-10-03T00:00:00+08:00'),
    sharable: true,
    ratable: false,
    e_coin: 1,
    achievement_submission_role: 'Both',
    status: 'Scheduled',
    created_by_user_oid: 1,
    created_at: now,
    updated_by_user_oid: 1,
    updated_at: now,
    version: 1
  },
  {
    category_oid: 5,
    name_en: 'HKICF2025',
    name_en_up_case: 'HKICF2025'.toUpperCase(),
    name_zh_hant: null,
    name_zh_hans: null,
    description: 'Hong Kong Inter-School Choral Festival 香港校際音樂節合唱隊',
    participant_grade: 63,
    start_date: new Date('2025-06-27T00:00:00+08:00'),
    end_date: new Date('2025-06-27T00:00:00+08:00'),
    sharable: true,
    ratable: false,
    e_coin: 2,
    achievement_submission_role: 'Both',
    status: 'Scheduled',
    created_by_user_oid: 1,
    created_at: now,
    updated_by_user_oid: 1,
    updated_at: now,
    version: 1
  }
]
;

async function main() {
  await prisma.activity.createMany({ data });

  console.log('Seed data successfully added!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
