export const entity2Dto = (src: Date | null | undefined): string | undefined => {
  return src ? src.toISOString() : undefined;
};

export const dto2Entity = (src: string | undefined): Date | undefined => {
  if (src) {
    const rtn = new Date(src);
    return isNaN(rtn.getTime()) ? undefined : rtn;
  } else {
    return undefined;
  }
};
