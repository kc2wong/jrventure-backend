import { UserRegistrationStatus } from '@prisma/client';
import { UserRegistrationStatusDto } from '../dto-schema';

export const entity2Dto = (
  src: UserRegistrationStatus
): UserRegistrationStatusDto => {
  switch (src) {
    case UserRegistrationStatus.pending:
      return 'Pending';
    case UserRegistrationStatus.approved:
      return 'Approved';
    case UserRegistrationStatus.rejected:
      return 'Rejected';
  }
};

export const dto2Entity = (
  src: UserRegistrationStatusDto
): UserRegistrationStatus => {
  switch (src) {
    case 'Pending':
      return UserRegistrationStatus.pending;
    case 'Approved':
      return UserRegistrationStatus.approved;
    case 'Rejected':
      return UserRegistrationStatus.rejected;
  }
};
