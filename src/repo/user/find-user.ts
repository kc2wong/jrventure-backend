import { db, Class, Student, User } from '@repo/db';
import { eq, and, or, ilike, inArray } from 'drizzle-orm';
import {
  classes,
  students,
  users,
  userStudents,
  UserRoleEnum,
  UserStatusEnum,
} from '@db/drizzle-schema';

type FindUserParams = {
  id?: number[];
  name?: string;
  email?: string;
  status?: UserStatusEnum[];
  role?: UserRoleEnum[];
  studentId?: string; // classId and studentNumber
};

type FindUserResult = {
  user: User;
  studentWithClass: { student: Student; clazz: Class }[];
};

export const findUserRepo = async ({
  id,
  email,
  name,
  status,
  role,
  studentId,
}: FindUserParams): Promise<FindUserResult[]> => {
  try {
    const conditions = [];
    if (id) conditions.push(inArray(users.oid, id));
    if (email) conditions.push(eq(users.email, email));
    if (status) conditions.push(inArray(users.status, status));
    if (role) conditions.push(inArray(users.role, role));

    if (name) {
      conditions.push(
        or(
          ilike(users.nameEn, `%${name}%`),
          ilike(users.nameZhHans, `%${name}%`),
          ilike(users.nameZhHant, `%${name}%`)
        )
      );
    }

    if (studentId) {
      conditions.push(
        inArray(
          users.oid,
          db
            .select({ userOid: userStudents.userOid })
            .from(userStudents)
            .leftJoin(students, eq(userStudents.studentOid, students.oid))
            .where(eq(students.id, studentId))
        )
      );
    }

    const userData = await db
      .select({
        user: users,
        entitledStudent: userStudents,
        student: students,
        clazz: classes,
      })
      .from(users)
      .leftJoin(userStudents, eq(userStudents.userOid, users.oid))
      .leftJoin(students, eq(userStudents.studentOid, students.oid))
      .leftJoin(classes, eq(students.classOid, classes.oid))
      .where(and(...conditions));

    // Group by user
    const map = new Map<
      number,
      {
        user: typeof users.$inferSelect;
        studentWithClass: {
          student: typeof students.$inferSelect;
          clazz: typeof classes.$inferSelect;
          sequence: number;
        }[];
      }
    >();

    for (const row of userData) {
      const userOid = row.user.oid;
      if (!map.has(userOid)) {
        map.set(userOid, {
          user: row.user,
          studentWithClass: [],
        });
      }

      if (row.student && row.clazz && row.entitledStudent) {
        map.get(userOid)!.studentWithClass.push({
          student: row.student,
          clazz: row.clazz,
          sequence: row.entitledStudent.sequence ?? 0,
        });
      }
    }

    return Array.from(map.values()).map((entry) => ({
      user: entry.user,
      studentWithClass: entry.studentWithClass
        .sort((a, b) => a.sequence - b.sequence)
        .map(({ sequence, ...rest }) => rest), // remove sequence from final output
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

