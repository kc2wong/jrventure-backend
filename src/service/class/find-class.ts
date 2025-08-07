import { FindClassQueryDto } from '@api/class/class-schema';
import {
  ClassDto,
} from '@api/student/student-schema';
import { findClassRepo } from '@repo/class/find-class';
import { entity2Dto } from '@service/class/mapper/class-mapper';

export const findClassService = async (
  query: FindClassQueryDto
): Promise<ClassDto[]> => {
  const { grade, classNumber } = query;

  const result = await findClassRepo(grade, classNumber);
  return result.map((item) => entity2Dto(item));
};
