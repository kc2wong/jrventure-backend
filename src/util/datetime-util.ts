export const currentDatetime = (): Date => {
  return new Date(Date.now());
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};
