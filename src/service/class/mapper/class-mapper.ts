import { ClassDto } from '@api/student/student-schema';
import { Class } from '@repo/db';
import { safeParseInt } from '@util/string-util';

export const entity2DtoId = (grade: number, class_number: string): string => {
  return `${grade}${class_number}`;
};

export const entity2Dto = (src: Class): ClassDto => {
  const { grade, classNumber } = src;
  return {
    id: entity2DtoId(grade, classNumber),
    grade,
    classNumber,
  };
};

export const classIdDto2Entity = (
  classId: string
): [number, string] | undefined => {
  if (classId.length != 2) {
    return undefined;
  }

  const gradeRaw = classId.charAt(0);
  const grade = safeParseInt(gradeRaw);
  if (grade === undefined) {
    return undefined;
  }
  const classNumber = classId.charAt(1);

  return [grade, classNumber];
};
