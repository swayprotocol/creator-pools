import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import STAKING_ABI from '../shared/abis/staking-abi.json';
import { Plan } from '../shared/interfaces';

export async function getPlans(planIds: number[], address: string, provider: string): Promise<Plan[]> {
  const rpcProvider = new JsonRpcProvider(provider);
  const stakingContract = new Contract(address!, STAKING_ABI, rpcProvider);

  return Promise.all(planIds.map(planId => {
    return stakingContract.plans(planId).then(res => ({
      planId: planId,
      apy: res.apy,
      availableUntil: new Date(+ethers.utils.formatUnits(res.availableUntil, 0) * 1000),
      lockMonths: res.lockMonths
    }));
  }));
}
