import { eq, and } from 'drizzle-orm';

import { users, userStudents } from '@db/drizzle-schema';
import { db, Student, User } from '@repo/db';
import { logger } from '@util/logging-util';

export const updateUserRepo = async (
  user: User,
  students?: Student[]
): Promise<User> => {
  const { oid, version, ...rest } = user;

  try {
    // Perform optimistic locking by updating with version match
    const updatedUsers = await db
      .update(users)
      .set({
        ...rest,
        version: version + 1,
      })
      .where(and(eq(users.oid, oid), eq(users.version, version)))
      .returning();

    if (updatedUsers.length === 0) {
      throw new Error('Optimistic Locking Failed: The record was modified by another process.');
    }

    // If students provided, delete existing and insert new ones
    if (students) {
      // Delete existing mappings
      await db.delete(userStudents).where(eq(userStudents.userOid, oid));

      // Insert new mappings
      if (students.length > 0) {
        await db.insert(userStudents).values(
          students.map((student, idx) => ({
            userOid: oid,
            studentOid: student.oid,
            sequence: idx + 1,
          }))
        );
      }
    }

    return updatedUsers[0];
  } catch (error) {
    logger.error(`Error updating user: ${JSON.stringify(error)}`);
    throw error;
  }
};

