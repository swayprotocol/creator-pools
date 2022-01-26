export interface StakedEvent {
  amount: number;
  poolHandle: string;
  sender: string;
  date: Date;
  social: StakedEventSocialType;
  plan?: Plan;
  unlockTime?: Date;
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
  averageAPR: number;
}

export interface ChannelPosition {
  amount: number;
  indexInPool: number;
  planId: number;
  plan: Plan;
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
  channel?: Partial<Channel>,
  amount?: string
}

export interface Plan {
  planId: number;
  apy: number;
  availableUntil: Date;
  lockMonths: number;
  createdAt?: Date;
}

type DistributionT = {
  [key in StakedEventSocialType]: number;
}

export interface Distribution extends Partial<DistributionT> {
  total: number;
}
