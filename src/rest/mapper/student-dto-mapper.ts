import { Class, Student } from '@prisma/client';
import { StudentDto } from '../dto-schema';
import { entity2DtoId as classEntity2DtoId } from './class-dto-mapper';
import { safeParseInt } from '../../util/string-util';

export const entity2Dto = (src: Student, clazz: Class): StudentDto => {
  const firstName = {
    English: src.firstname_en,
    TraditionalChinese: src.firstname_zh_hant,
    SimplifiedChinese: src.firstname_zh_hans,
  };
  const lastName = {
    English: src.lastname_en,
    TraditionalChinese: src.lastname_zh_hant,
    SimplifiedChinese: src.lastname_zh_hans,
  };
  const classId = classEntity2DtoId(
    clazz.grade,
    clazz.class_number
  );
  return {
    id: src.id,
    classId,
    firstName,
    lastName,
    studentNumber: src.student_number,
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