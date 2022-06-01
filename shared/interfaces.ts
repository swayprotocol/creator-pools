export interface StakedEvent {
  amount: number;
  poolHandle: string;
  sender: string;
  date: Date;
  social: string;
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

export interface IChannel {
  averageAPY: number;
  members: string[];
  numberOfStakes: number;
  poolHandle: string;
  totalAmount: number;
  totalFarmed: number;
  pool: IPool;
  social: string;
  stakes: IStake[];
}

export interface StakeData {
  poolHandle: string;
  planId: string;
  amount: string;
  social: string;
}

export interface ModalData {
  type?: ModalType,
  channel?: Partial<IChannel>,
  amount?: string
}

export interface IPlan {
  blockchainIndex: number;
  apy: number;
  availableUntil: Date;
  lockMonths: number;
  createdAt: Date;
  _id: string;
}

export interface IChannelDistributionItem {
  name: string;
  prefix: string;
  count?: number;
}

export interface IPool {
  _id: string;
  creator: string;
  startTime: Date;
  poolHandle?: string;
  social: string;
}

export interface IStake {
  _id: string;
  plan: IPlan;
  pool: IPool;
  stakedAt: Date;
  stakedUntil: Date;
  amount: number;
  wallet: string;
  collected: boolean;
  hash: string;
  farmed: number;
}

export interface IDistribution {
  channel: string;
  distribution: string;
}
