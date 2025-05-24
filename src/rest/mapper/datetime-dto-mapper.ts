export function entity2Dto(src: Date): string;
export function entity2Dto(src: null | undefined): undefined;
export function entity2Dto(src: Date | null): string | undefined; // ✅ Add this overload
export function entity2Dto(src: Date | null | undefined): string | undefined {
  return src ? src.toISOString() : undefined;
}

export function dto2Entity(src: string): Date;
export function dto2Entity(src: null | undefined): undefined;
export function dto2Entity(src: string | null | undefined): Date | undefined {
  if (src) {
    const rtn = new Date(src);
    return isNaN(rtn.getTime()) ? undefined : rtn;
  } else {
    return undefined;
  }
}
