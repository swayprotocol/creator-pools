import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import STAKING_ABI from '../shared/abis/staking-abi.json';
import { Event } from '@ethersproject/contracts';
import { StakedEvent } from '../shared/interfaces';

export function getStakedData(): Promise<StakedEvent[]> {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_WEB3_HTTP_PROVIDER);
  const stakingContract = new Contract(process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS!, STAKING_ABI, provider);

  // filter by 'Staked' event only
  const filter = stakingContract.filters.Staked();

  return stakingContract.queryFilter(filter, 21001090).then((logs: Event[]) =>
    Promise.all(logs.map(async (log: Event) => ({
      // log: log,
      amount: +ethers.utils.formatEther(log.args!.amount),
      poolHandle: log.args!.poolHandle,
      sender: log.args!.sender,
      date: await log.getBlock().then(res => new Date(res.timestamp * 1000)),
    })))
  );
}
