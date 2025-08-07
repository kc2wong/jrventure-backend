import {
  CreateActivityDto,
  ActivityDto,
  FindActivityOrderByFieldDto,
  UpdateActivityDto,
} from '@api/activity/activity-schema';
import { Activity, ActivityCategory, ActivityCreationEntity } from '@repo/db';
import {
  entity2Dto as achievementSubmissionRoleEntity2Dto,
  dto2Entity as achievementSubmissionRoleDto2Entity,
} from '@service/activity/mapper/achievement-submission-role-mapper';
import {
  entity2Dto as activityStatusEntity2Dto,
  dto2Entity as activityStatusDto2Entity,
} from '@service/activity/mapper/activity-status-mapper';
import {
  entity2Dto as datetimeEntity2Dto,
  dto2Entity as datetimeDto2Entity,
} from '@shared/mapper/datetime-mapper';
import { removeNilValues } from '@util/string-util';

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
  // src: Activity,
  {
    oid,
    nameEn,
    nameZhHans,
    nameZhHant,
    description,
    startDate,
    endDate,
    status,
    participantGrade,
    sharable,
    ratable,
    eCoin,
    achievementSubmissionRole,
    createdByUserOid,
    createdAt,
    updatedByUserOid,
    updatedAt,
    version,
  }: Activity,
  category: ActivityCategory
): ActivityDto => {
  return {
    id: oid.toString(),
    categoryCode: category.code,
    name: removeNilValues({
      English: nameEn,
      TraditionalChinese: nameZhHant,
      SimplifiedChinese: nameZhHans,
    }),
    description: description,
    startDate: datetimeEntity2Dto(startDate),
    endDate: datetimeEntity2Dto(endDate),
    status: activityStatusEntity2Dto(status),
    participantGrade: bitmaskToArray(participantGrade),
    sharable: sharable,
    ratable: ratable,
    eCoin: eCoin,
    createdBy: createdByUserOid.toString(),
    createdAt: datetimeEntity2Dto(createdAt),
    updatedBy: updatedByUserOid.toString(),
    updatedAt: datetimeEntity2Dto(updatedAt),
    version: version,
    achievementSubmissionRole: achievementSubmissionRoleEntity2Dto(
      achievementSubmissionRole
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
  }: CreateActivityDto,
  category: ActivityCategory
): ActivityCreationEntity => {
  const nameEn = name.English ? (name.English as string) : null;
  return {
    nameEn,
    nameEnUpCase: nameEn ? nameEn.toUpperCase() : null,
    nameZhHant: name.TraditionalChinese
      ? (name.TraditionalChinese as string)
      : null,
    nameZhHans: name.SimplifiedChinese
      ? (name.SimplifiedChinese as string)
      : null,
    description,
    startDate: datetimeDto2Entity(startDate),
    endDate: datetimeDto2Entity(endDate),
    participantGrade: arrayToBitmask(participantGrade),
    eCoin,
    achievementSubmissionRole: achievementSubmissionRoleDto2Entity(
      achievementSubmissionRole
    ),
    status: activityStatusDto2Entity(status),
    categoryOid: category.oid,
    sharable,
    ratable,
  };
};

export const updateDto2Entity = (
  updateDto: UpdateActivityDto,
  activity: Activity,
  category: ActivityCategory
): Activity => {
  const entity = creationDto2Entity(updateDto, category);
  return {
    ...activity,
    ...entity,
  };
};

const orderByfieldMapping: Record<
  FindActivityOrderByFieldDto,
  'name_en' | 'start_date' | 'end_date'
> = {
  Name: 'name_en',
  StartDate: 'start_date',
  EndDate: 'end_date',
};

export const orderByFieldDto2Entity = (
  src: FindActivityOrderByFieldDto
): 'name_en' | 'start_date' | 'end_date' => orderByfieldMapping[src];
