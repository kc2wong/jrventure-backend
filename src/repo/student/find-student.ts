import { Class, Student } from '@prisma/client';
import prisma from '@repo/db';

export const findStudentRepo = async (
  id?: string[],
  name?: string,
  classOid?: number,
  studentNumber?: number
): Promise<[Student, Class][]> => {
  try {
    const result = await prisma.student.findMany({
      where: {
        ...(id && { id: { in: id } }),
        ...(classOid && { class_oid: classOid }),
        ...(studentNumber && { student_number: studentNumber }),
        ...(name && {
          OR: [
            { name_en: { contains: name, mode: 'insensitive' } },
            { name_zh_hans: { contains: name, mode: 'insensitive' } },
            { name_zh_hant: { contains: name, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        class: true,
      },
    });
    return result.map((item) => [item, item.class]);
  } catch (error) {
    throw error;
  }
};
