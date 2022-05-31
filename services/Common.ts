import { IDistribution, IPlan, IPool, IStake } from '../shared/interfaces';
import { getSocialType } from '../helpers/getSocialType';

const headers = {
  'Content-Type': 'application/json',
  'credentials': 'include'
}

const handleResponse = (res: Response) => {
  if (res.status === 200) {
    return res.json();
  }
  throw Error(`Error ${res.status}`);
};

const CommonService = {
  getActivePlans: (): Promise<IPlan[]> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/plan/active`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .catch(error => {
        throw Error(error);
      });
  },

  getMaxApyPlan: (): Promise<IPlan> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/plan/maxApy`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .catch(error => {
        throw Error(error);
      });
  },

  getLatestStakes: (): Promise<IStake[]> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/latestStakes`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .then((res: IStake[]) => (
        res.map(stake => ({
          ...stake,
          pool: {
            ...stake.pool,
            poolHandle: stake.pool.creator.split('-')[1],
            social: getSocialType(stake.pool.creator)
          }
        }))
      ))
      .catch(error => {
        throw Error(error);
      });
  },

  getTopStakes: (): Promise<{ pool: IPool, amount: number }[]> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/topStakedPools`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .then((res: { pool: IPool, totalAmount: number }[]) => (
        res.map(stake => ({
          amount: stake.totalAmount,
          pool: {
            ...stake.pool,
            poolHandle: stake.pool.creator.split('-')[1],
            social: getSocialType(stake.pool.creator)
          }
        }))
      ))
      .catch(error => {
        throw Error(error);
      });
  },

  getHighestPositions: (): Promise<IStake[]> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/highestPositions`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .then((res: IStake[]) => (
        res.map(stake => ({
          ...stake,
          pool: {
            ...stake.pool,
            poolHandle: stake.pool.creator.split('-')[1],
            social: getSocialType(stake.pool.creator)
          }
        }))
      ))
      .catch(error => {
        throw Error(error);
      });
  },

  getUserActiveStakes: (walletId: string): Promise<IStake[]> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/activeStakes/${walletId}`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .then((res: IStake[]) => (
        res.map(stake => ({
          ...stake,
          pool: {
            ...stake.pool,
            poolHandle: stake.pool.creator.split('-')[1],
            social: getSocialType(stake.pool.creator)
          }
        }))
      ))
      .catch(error => {
        throw Error(error);
      });
  },

  getTotalCurrentlyStaked: (): Promise<number> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/totalCurrentlyStaked`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .catch(error => {
        throw Error(error);
      });
  },

  getTotalRewards: (): Promise<number> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/claim/totalRewards`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .catch(error => {
        throw Error(error);
      });
  },

  getChanelDistribution: (): Promise<IDistribution[]> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/chanelDistribution`, {
      method: 'GET',
      headers,
    }).then(handleResponse)
      .catch(error => {
        throw Error(error);
      });
  },
};

export default CommonService;
