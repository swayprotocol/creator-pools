import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import STAKING_ABI from '../shared/abis/staking-abi.json';
import { Event } from '@ethersproject/contracts';
import { StakedEvent, StakedEventSocialType } from '../shared/interfaces';

export function getStakedData(): Promise<StakedEvent[]> {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_WEB3_HTTP_PROVIDER);
  const stakingContract = new Contract(process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS!, STAKING_ABI, provider);

  // filter by 'Staked' event only
  const filter = stakingContract.filters.Staked();

  return stakingContract.queryFilter(filter, 21001090).then((logs: Event[]) =>
    Promise.all(logs.map(async (log: Event) => ({
      // log: log,
      amount: +ethers.utils.formatEther(log.args!.amount),
      poolHandle: log.args!.poolHandle.split('-')[1],
      sender: log.args!.sender,
      social: getEventSocialType(log.args!.poolHandle),
      date: await log.getBlock().then(res => new Date(res.timestamp * 1000)),
    })))
  );
}

const getEventSocialType = (poolHandle: string): StakedEventSocialType => {
  const socialString = poolHandle.split('-')[0];
  if (socialString === 'ig') {
    return StakedEventSocialType.IG;
  } else if (socialString === 'tt') {
    return StakedEventSocialType.TT;
  } else if (socialString === 'ens') {
    return StakedEventSocialType.ENS;
  }
}
