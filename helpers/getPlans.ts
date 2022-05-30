import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import { Plan } from '../shared/interfaces';
import getStakingAbi from './getStakingAbi';

export async function getPlans(planIds: number[], address: string, provider: string, abiFile: string): Promise<Plan[]> {
  const rpcProvider = new JsonRpcProvider(provider);
  const stakingAbi = await getStakingAbi(abiFile);
  const stakingContract = new Contract(address!, stakingAbi, rpcProvider);

  return Promise.all(planIds.map(planId => {
    return stakingContract.plans(planId).then(res => ({
      planId: planId,
      apy: res.apy,
      availableUntil: new Date(+ethers.utils.formatUnits(res.availableUntil, 0) * 1000),
      lockMonths: res.lockMonths
    }));
  }));
}
