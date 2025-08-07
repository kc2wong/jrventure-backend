import {
  FindActivity200ResponseDto,
  FindActivityQueryDto,
} from '@api/activity/activity-schema';
import { findActivityRepo } from '@repo/activity/find-activity';
import { dto2Entity as submissionRoleDto2Entity } from '@service/activity/mapper/achievement-submission-role-mapper';
import { entity2Dto } from '@service/activity/mapper/activity-mapper';
import { dto2Entity as statusDto2Entity } from '@service/activity/mapper/activity-status-mapper';
import { dto2Entity as orderByFieldDto2Entity } from '@service/activity/mapper/order-by-field-mapper';
import { dto2Entity as datetimeDto2Entity } from '@shared/mapper/datetime-mapper';
import { dto2Entity as orderByDirectionDto2Entity } from '@shared/mapper/order-by-direction-mapper';
import { safeParseInt } from '@util/string-util';

export const findActivityService = async (
  query: FindActivityQueryDto
): Promise<FindActivity200ResponseDto> => {
  const {
    id,
    orderByField,
    orderByDirection,
    startDateFrom,
    startDateTo,
    endDateFrom,
    endDateTo,
    role,
    status,
    ...rest
  } = query;

  const { total, offset, data } = await findActivityRepo({
    ...rest,
    oid: id ? id.map((i) => safeParseInt(i) ?? -1) : undefined,
    role: role ? role.map((r) => submissionRoleDto2Entity(r)) : undefined,
    startDateFrom: startDateFrom
      ? datetimeDto2Entity(startDateFrom)
      : undefined,
    startDateTo: startDateTo ? datetimeDto2Entity(startDateTo) : undefined,
    endDateFrom: endDateFrom ? datetimeDto2Entity(endDateFrom) : undefined,
    endDateTo: endDateTo ? datetimeDto2Entity(endDateTo) : undefined,
    status: status ? status.map((s) => statusDto2Entity(s)) : undefined,
    orderByField: orderByFieldDto2Entity(orderByField ?? 'StartDate'),
    orderByDirection: orderByDirectionDto2Entity(
      orderByDirection ?? 'Descending'
    ),
  });

  return {
    total,
    offset: offset ?? query.offset,
    limit: query.limit,
    data: data.map(({ activity, category }) => entity2Dto(activity, category)),
  };
};