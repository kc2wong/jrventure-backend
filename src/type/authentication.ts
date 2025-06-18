export type AuthenticatedUser = {
  oid: number;
  entitledAllStudent: boolean;
  entitledStudentId: string[];
  userRole: 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Alumni';
  withApprovalRight: boolean;
};
