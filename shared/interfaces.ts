export interface StakedEvent {
  amount: number;
  poolHandle: string;
  sender: string;
  date: Date;
  social: StakedEventSocialType
}

export enum PoolItemType {
  TOP = 'Top',
  LATEST = 'Latest',
  INDIVIDUAL = 'Individual',
}

export enum StakedEventSocialType {
  IG = 'Instagram',
  TT = 'TikTok',
  ENS = 'Ethereum Name Service',
}
