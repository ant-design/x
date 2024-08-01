import type { SorterMap } from './interface';

const sorters: SorterMap = {
  TIME_ACS (data) {
    return data.sort((a, b) => {
      if (a.timestamp && b.timestamp) return a.timestamp - b.timestamp;

      return 0;
    });
  },
};

export default sorters;
