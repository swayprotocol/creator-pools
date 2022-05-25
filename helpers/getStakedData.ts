import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import { Event } from '@ethersproject/contracts';
import { StakedEvent } from '../shared/interfaces';
import { getSocialType } from './getSocialType';
import getStakingAbi from './getStakingAbi';

export function getStakedData(address: string, provider: string, abiFile: string): Promise<StakedEvent[]> {
  const rpcProvider = new JsonRpcProvider(provider);
  const stakingAbi = getStakingAbi(abiFile);
  const stakingContract = new Contract(address!, stakingAbi, rpcProvider);

  // filter by 'Staked' event only
  const filter = stakingContract.filters.Staked();

  return stakingContract.queryFilter(filter, 21001090).then((logs: Event[]) =>
    Promise.all(logs.map(async (log: Event) => ({
      // log: log,
      amount: +ethers.utils.formatEther(log.args!.amount),
      poolHandle: log.args!.poolHandle.split('-')[1],
      sender: log.args!.sender,
      social: getSocialType(log.args!.poolHandle),
      date: await log.getBlock().then(res => new Date(res.timestamp * 1000)),
    })))
  );
}
