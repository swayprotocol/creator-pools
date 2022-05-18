export interface StakedEvent {
  amount: number;
  poolHandle: string;
  sender: string;
  date: Date;
  social: string;
  plan?: Plan;
  unlockTime?: Date;
}

export enum PoolItemType {
  TOP = 'Top',
  LATEST = 'Latest',
  INDIVIDUAL = 'Individual',
}

export enum ModalType {
  STAKE = 'Stake',
  UNSTAKE = 'Unstake',
  ADD = 'Stake additional position',
  CLAIM = 'Claim'
}

export interface Channel {
  poolHandle: string;
  userTotalAmount: number;
  social: string;
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
  social: string;
  farmed: number;
}

export interface StakeData {
  poolHandle: string;
  planId: string;
  amount: string;
  social: string;
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

export interface IChannelDistributionItem {
  name: string;
  prefix: string;
  count?: number;
}
