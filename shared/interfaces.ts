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
  walletAverageAPY: number;
  walletFarmed: number;
  walletStakesCount: number;
  walletTotalAmount: number;
  token0: ItokenInfo;
  token1: ItokenInfo;
}
export interface ItokenInfo{
  averageAPY: number,
  stakesCount: number,
  totalAmount: number,
  totalFarmed: number,
  walletAverageAPY: number,
  walletFarmed: number,
  walletStakesCount: number,
  walletTotalAmount: number
}

export interface StakeData {
  social: string;
  poolHandle: string;
  amount: string;
  tokenType: number;
}

export interface ModalData {
  type?: ModalType,
  channel?: Partial<IChannel>,
  amount?: string,
  tokenType?: string
}
export interface Itokens {
  name: string,
  price: number,
  totalAmount: number
}

export interface IPool {
  _id: string;
  creator: string;
  startTime: Date;
  poolHandle?: string;
  social: string;
  tokens: Itokens[];
}

export interface IStake {
  _id: string;
  pool: IPool;
  stakedAt: Date;
  stakedUntil: Date;
  amount: number;
  wallet: string;
  collected: boolean;
  hash: string;
  farmed: number;
  token: string;
  tokens: Itokens[];
}

export interface IToken {
  totalStaked: number;
  APY: number;
  totalFarmed: number;
}

export interface IOverview {
  Itoken: IToken[];
}
