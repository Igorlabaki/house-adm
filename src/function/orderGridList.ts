import { ImageGridType } from '@/types';

export const orderList = (list: ImageGridType[]): ImageGridType[] => {
  function compare(a: ImageGridType, b: ImageGridType) {
    if (a.position > b.position) return 1;
    if (a.position > b.position) return -1;
    return 0;
  }

  return list?.sort(compare);
};
