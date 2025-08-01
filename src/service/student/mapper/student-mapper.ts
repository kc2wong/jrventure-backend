import { entity2DtoId as classEntity2DtoId } from '@service/class/mapper/class-mapper';
import { safeParseInt } from '@util/string-util';
import { StudentDto } from '@api/student/student-schema';
import { Class, Student } from '@repo/db';

export const entity2Dto = (src: Student, clazz: Class): StudentDto => {
  const { id, studentNumber } = src;
  const firstName = {
    English: src.firstnameEn,
    TraditionalChinese: src.firstnameZhHant,
    SimplifiedChinese: src.firstnameZhHans,
  };
  const lastName = {
    English: src.lastnameEn,
    TraditionalChinese: src.lastnameZhHant,
    SimplifiedChinese: src.firstnameZhHans,
  };
  const classId = classEntity2DtoId(clazz.grade, clazz.classNumber);
  return {
    id,
    classId,
    firstName,
    lastName,
    studentNumber,
  };
};

/** Split Student Id to classId and Student Number */
export const studentIdDto2Entity = (
  studentId?: string
): [string, number] | undefined => {
  if (studentId === undefined) {
    return undefined;
  }
  const tokens = studentId.split('-');
  if (tokens.length != 2) {
    return undefined;
  }

  const studentNumber = safeParseInt(tokens[1]);
  if (studentNumber === undefined) {
    return undefined;
  }

  return [tokens[0], studentNumber];
};
