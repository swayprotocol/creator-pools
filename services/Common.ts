import {IChannel, IOverview, IPool, IStake, IToken} from '../shared/interfaces';
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
                        poolHandle: stake.pool.creator,
                        social: getSocialType(stake.pool.creator)
                    }
                }))
            ))
            .catch(error => {
                throw Error(error);
            });
    },

    getTopStakes: (): Promise<{ pool: IPool }[]> => {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/topStakedPools`, {
            method: 'GET',
            headers,
        }).then(handleResponse)
            .then((res: { pool: IPool, tokens: IToken }[]) => (
                res.map(stake => ({
                    ...stake,
                    pool: {
                        ...stake.pool,
                        poolHandle: stake.pool.creator,
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
                        poolHandle: stake.pool.creator,
                        social: getSocialType(stake.pool.creator)
                    }
                }))
            ))
            .catch(error => {
                throw Error(error);
            });
    },

    getUserActivePools: (wallet: string): Promise<IChannel[]> => {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/activeStakesWallet?wallet=${wallet}`, {
            method: 'GET',
            headers,
        }).then(handleResponse)
            .catch(error => {
                throw Error(error);
            });
    },

    getTotalCurrentlyStaked: (): Promise<number[]> => {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/totalCurrentlyStaked`, {
            method: 'GET',
            headers,
        }).then(handleResponse)
            .catch(error => {
                throw Error(error);
            });
    },
    getOverview: (): Promise<IOverview> => {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/stake/overview`, {
            method: 'GET',
            headers,
        }).then(handleResponse)
            .catch(error => {
                throw Error(error);

            });
    }
};

export default CommonService;