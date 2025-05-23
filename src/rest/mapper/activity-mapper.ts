import { Activity, ActivityCategory } from '@prisma/client';
import { ActivityDto } from '../dto-schema';
import { entity2Dto as datetimeEntity2Dto } from './datetime-dto-mapper';
import  { entity2Dto as activityStatusEntity2Dto} from './activity-status-dto-mapper';
import  { entity2Dto as achievementSubmissionRoleEntity2Dto} from './achievement-submission-role-dto-mapper'

const bitmaskToArray = (bitmask: number): number[] => {
  const enabledBits: number[] = [];
  for (let i = 0; i < 32; i++) {
    if ((bitmask & (1 << i)) !== 0) {
      enabledBits.push(i + 1);
    }
  }
  return enabledBits;
};

export const entity2Dto = (
  src: Activity,
  category: ActivityCategory
): ActivityDto => {
  return {
    id: src.oid.toString(),
    categoryCode: category.code,
    name: {
      English: src.name_en,
      TraditionalChinese: src.name_zh_hant,
      SimplifiedChinese: src.name_zh_hans,
    },
    description: src.description,
    startDate: src.start_date?.toISOString() ?? '',
    endDate: src.end_date?.toISOString() ?? '',
    status: activityStatusEntity2Dto(src.status),
    participantGrade: bitmaskToArray(src.participant_grade),
    sharable: src.sharable,
    ratable: src.ratable,
    eCoin: src.e_coin,
    createdBy: src.created_by_user_oid.toString(),
    createdAt: datetimeEntity2Dto(src.created_at)!,
    updatedBy: src.updated_by_user_oid.toString(),
    updatedAt: datetimeEntity2Dto(src.updated_at)!,
    version: src.version,
    achievementSubmissionRole: achievementSubmissionRoleEntity2Dto(src.achievement_submission_role),
  };
};
