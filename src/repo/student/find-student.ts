import { eq, ilike, inArray, and, or } from 'drizzle-orm';
import { classes, students } from '@db/drizzle-schema';
import { db, Class, Student } from '@repo/db';

export const findStudentRepo = async (
  id?: string[],
  name?: string,
  classOid?: number,
  studentNumber?: number
): Promise<[Student, Class][]> => {
  let whereClauses = [];

  if (id) {
    whereClauses.push(inArray(students.id, id));
  }
  if (classOid) {
    whereClauses.push(eq(students.classOid, classOid));
  }
  if (studentNumber) {
    whereClauses.push(eq(students.studentNumber, studentNumber));
  }

  if (name) {
    whereClauses.push(
      or(
        ilike(students.nameEn, `%${name}%`),
        ilike(students.nameZhHans, `%${name}%`),
        ilike(students.nameZhHant, `%${name}%`)
      )
    );
  }

  const result = await db
    .select({
      student: students,
      class: classes,
    })
    .from(students)
    .innerJoin(classes, eq(classes.oid, students.classOid))
    .where(whereClauses.length > 0 ? and(...whereClauses) : undefined);

  return result.map((row) => [row.student, row.class]);
};

