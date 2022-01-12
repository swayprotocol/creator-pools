export interface StakedEvent {
  amount: number;
  poolHandle: string;
  sender: string;
  date: Date;
}

export enum PoolItemType {
  TOP = 'Top',
  LATEST = 'Latest',
  INDIVIDUAL = 'Individual',
}
