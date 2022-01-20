import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';
import STAKING_ABI from '../shared/abis/staking-abi.json';
import { Plan } from '../shared/interfaces';

export async function getPlans(planIds: number[]): Promise<Plan[]> {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_WEB3_HTTP_PROVIDER);
  const stakingContract = new Contract(process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS!, STAKING_ABI, provider);

  return Promise.all(planIds.map(planId => {
    return stakingContract.plans(planId).then(res => ({
      planId: planId,
      apy: res.apy,
      availableUntil: new Date(+ethers.utils.formatUnits(res.availableUntil, 0) * 1000),
      lockMonths: res.lockMonths
    }));
  }));
}
