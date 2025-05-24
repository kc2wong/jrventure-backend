import { Activity, ActivityCategory } from '@prisma/client';
import { ActivityPayloadDto, ActivityDto } from '../dto-schema';
import {
  entity2Dto as datetimeEntity2Dto,
  dto2Entity as datetimeDto2Entity,
} from './datetime-dto-mapper';
import {
  entity2Dto as activityStatusEntity2Dto,
  dto2Entity as activityStatusDto2Entity,
} from './activity-status-dto-mapper';
import {
  entity2Dto as achievementSubmissionRoleEntity2Dto,
  dto2Entity as achievementSubmissionRoleDto2Entity,
} from './achievement-submission-role-dto-mapper';
import {
  ActivityCategoryEntity,
  ActivityCreationEntity,
} from '../../repo/entity/db_entity';
import { removeNilValues } from '../../util/string-util';

const bitmaskToArray = (bitmask: number): number[] => {
  const enabledBits: number[] = [];
  for (let i = 0; i < 32; i++) {
    if ((bitmask & (1 << i)) !== 0) {
      enabledBits.push(i + 1);
    }
  }
  return enabledBits;
};

const arrayToBitmask = (value: number[]): number => {
  const bitmaskValue = [1, 2, 4, 8, 16, 32];
  let bitmask = 0;
  for (let i = 0; i < value.length; i++) {
    const index = value[i] - 1;
    if (index >= 0 && index < bitmaskValue.length) {
      bitmask |= bitmaskValue[index];
    }
  }
  return bitmask;
};

export const entity2Dto = (
  src: Activity,
  category: ActivityCategory
): ActivityDto => {
  return {
    id: src.oid.toString(),
    categoryCode: category.code,
    name: removeNilValues({
      English: src.name_en,
      TraditionalChinese: src.name_zh_hant,
      SimplifiedChinese: src.name_zh_hans,
    }),
    description: src.description,
    startDate: datetimeEntity2Dto(src.start_date),
    endDate: datetimeEntity2Dto(src.end_date),
    status: activityStatusEntity2Dto(src.status),
    participantGrade: bitmaskToArray(src.participant_grade),
    sharable: src.sharable,
    ratable: src.ratable,
    eCoin: src.e_coin,
    createdBy: src.created_by_user_oid.toString(),
    createdAt: datetimeEntity2Dto(src.created_at),
    updatedBy: src.updated_by_user_oid.toString(),
    updatedAt: datetimeEntity2Dto(src.updated_at),
    version: src.version,
    achievementSubmissionRole: achievementSubmissionRoleEntity2Dto(
      src.achievement_submission_role
    ),
  };
};

export const creationDto2Entity = (
  {
    name,
    participantGrade,
    startDate,
    endDate,
    achievementSubmissionRole,
    status,
    eCoin,
    description,
    sharable,
    ratable,
  }: ActivityPayloadDto,
  category: ActivityCategoryEntity
): ActivityCreationEntity => {
  const nameEn = name.English ? (name.English as string) : null;
  return {
    name_en: nameEn,
    name_en_up_case: nameEn ? nameEn.toUpperCase() : null,
    name_zh_hant: name.TraditionalChinese
      ? (name.TraditionalChinese as string)
      : null,
    name_zh_hans: name.SimplifiedChinese
      ? (name.SimplifiedChinese as string)
      : null,
    description,
    start_date: datetimeDto2Entity(startDate),
    end_date: datetimeDto2Entity(endDate),
    participant_grade: arrayToBitmask(participantGrade),
    e_coin: eCoin,
    achievement_submission_role: achievementSubmissionRoleDto2Entity(
      achievementSubmissionRole
    ),
    status: activityStatusDto2Entity(status),
    category_oid: category.oid,
    sharable,
    ratable,
  };
};
