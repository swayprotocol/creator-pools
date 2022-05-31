export interface StakedEvent {
  amount: number;
  poolHandle: string;
  social: string;
  sender: string;
  date: Date;
  tokenType: number;
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
  poolHandle: string;
  lastTimeClaimed: Date;
  social: string;
  farmed: number;
}

export interface StakeData {
  social: string;
  poolHandle: string;
  amount: string;
  tokenType: number;
}

export interface ModalData {
  type?: ModalType,
  channel?: Partial<Channel>,
  amount?: string,
  tokenType?: string
}

export interface IChannelDistributionItem {
  name: string;
  prefix: string;
  count?: number;
}
