import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle-schema'; // adjust path as needed

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

const data = [
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
  await client.connect();
  const db = drizzle(client, { schema });

  await db.insert(schema.activityCategories).values(data);

  console.log('Seed data successfully added!');
  await client.end();
}

main().catch(async (err) => {
  console.error(err);
  await client.end();
});
