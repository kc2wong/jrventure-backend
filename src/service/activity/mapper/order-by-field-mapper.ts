import { FindActivityOrderByFieldDto } from '@api/activity/activity-schema';

const orderByfieldMapping: Record<
  FindActivityOrderByFieldDto,
  'name_en' | 'start_date' | 'end_date'
> = {
  Name: 'name_en',
  StartDate: 'start_date',
  EndDate: 'end_date',
};

export const dto2Entity = (
  src: FindActivityOrderByFieldDto
): 'name_en' | 'start_date' | 'end_date' => orderByfieldMapping[src];
