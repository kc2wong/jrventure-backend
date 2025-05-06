// import { Class, Student, User, UserRegistration } from '@prisma/client';
// import { UserRegistrationDto } from '../dto-schema';
// import { entity2Dto as userRegistrationStatusEntity2Dto } from './user-registration-status-dto-mapper';
// import { entity2Dto as classEntity2Dto } from './class-dto-mapper';

// export const entity2Dto = (
//   src: UserRegistration,
//   clazz: Class,
//   student: Student,
//   handler?: User
// ): UserRegistrationDto => {

//   const classDto = classEntity2Dto(clazz);
//   return {
//     id: src.id.toString(),
//     email: src.email,
//     classId: classDto.id,
//     studentNumber: student.student_number,
//     handledBy: handler?.id.toString(),
//     handledDatetime: src.handled_datetime?.toISOString() ?? undefined,
//     handlerRemark: src.handler_remark ?? undefined,
//     status: userRegistrationStatusEntity2Dto(src.status),
//   };
// };
