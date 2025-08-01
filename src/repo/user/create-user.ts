import { users, userStudents } from '@db/drizzle-schema';
import { db, Student, User } from '@repo/db';

export const createUserRepo = async (
  user: Omit<User, 'oid'>,
  students: Student[]
): Promise<User> => {
  try {
    // Insert user and get the inserted row with generated oid
    const [createdUser] = await db.insert(users).values(user).returning();

    // Insert entitled_students (user-student mappings) with sequence
    if (students.length > 0) {
      await db.insert(userStudents).values(
        students.map((student, idx) => ({
          userOid: createdUser.oid,
          studentOid: student.oid,
          sequence: idx + 1,
        }))
      );
    }

    return createdUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
