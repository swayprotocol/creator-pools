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

export enum ModalType {
  STAKE = 'Stake',
  UNSTAKE = 'Unstake',
  ADD = 'Stake additional position'
}

export interface Channel {
  poolHandle: string;
  totalAmount: number;
  social: StakedEventSocialType;
  farmed: number;
  positions: ChannelPosition[];
}

export interface ChannelPosition {
  amount: number;
  indexInPool: number;
  planId: number;
  poolHandle: string;
  stakedAt: Date;
  unlockTime: Date;
  social: StakedEventSocialType;
}

export interface StakeData {
  poolHandle: string;
  planId: string;
  amount: string;
  social: StakedEventSocialType;
}
