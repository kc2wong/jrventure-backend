import { FindStudentQueryDto, StudentDto } from '@api/student/student-schema';
import { classes, students } from '@db/drizzle-schema';
import { findClassRepo } from '@repo/class/find-class';
import { findStudentRepo } from '@repo/student/find-student';
import { classIdDto2Entity } from '@service/class/mapper/class-mapper';
import { entity2Dto } from '@service/student/mapper/student-mapper';

export const findStudentService = async (
  query: FindStudentQueryDto
): Promise<StudentDto[]> => {
  const { id: ids, classId, name } = query;

  const classsKey = classId ? classIdDto2Entity(classId) : undefined;
  const clazz = classsKey
    ? await findClassRepo(classsKey[0], classsKey[1])
    : undefined;
  // let result: [Student, Class][] = [];
  let result: [typeof students.$inferSelect, typeof classes.$inferSelect][];

  if (clazz == undefined) {
    // not search by class
    // result = await findStudentRepo(ids, name);
    result = await findStudentRepo(ids, name);
  } else {
    if (clazz.length == 1) {
      result = await findStudentRepo(ids, name, clazz[0].oid);
    } else {
      // class criteria is invalid
      result = [];
    }
  }
  return result.map(([student, clazz]) => entity2Dto(student, clazz));
};
