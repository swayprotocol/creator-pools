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
  userTotalAmount: number;
  social: StakedEventSocialType;
  totalFarmed: number;
  positions: ChannelPosition[];
  creator: string;
  members: number;
  numberOfStakes: number;
  totalAmount: number;
}

export interface ChannelPosition {
  amount: number;
  indexInPool: number;
  planId: number;
  poolHandle: string;
  stakedAt: Date;
  unlockTime: Date;
  social: StakedEventSocialType;
  farmed: number;
}

export interface StakeData {
  poolHandle: string;
  planId: string;
  amount: string;
  social: StakedEventSocialType;
}

export interface ModalData {
  type?: ModalType,
  channel?: Channel,
  amount?: string
}
