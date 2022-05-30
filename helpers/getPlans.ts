import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import { IPlan } from '../shared/interfaces';
import getStakingAbi from './getStakingAbi';

export async function getPlans(planIds: number[], address: string, provider: string, abiFile: string): Promise<IPlan[]> {
  const rpcProvider = new JsonRpcProvider(provider);
  const stakingAbi = getStakingAbi(abiFile);
  const stakingContract = new Contract(address!, stakingAbi, rpcProvider);

  return Promise.all(planIds.map(planId => {
    return stakingContract.plans(planId).then(res => ({
      blockchainIndex: planId,
      apy: res.apy,
      availableUntil: new Date(+ethers.utils.formatUnits(res.availableUntil, 0) * 1000),
      lockMonths: res.lockMonths
    }));
  }));
}
