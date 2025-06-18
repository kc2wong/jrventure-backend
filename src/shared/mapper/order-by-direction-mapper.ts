const fieldMapping: Record<'Ascending' | 'Descending', 'asc' | 'desc'> = {
  Ascending: 'asc',
  Descending: 'desc',
};

export const dto2Entity = (src: 'Ascending' | 'Descending'): 'asc' | 'desc' =>
  fieldMapping[src];
